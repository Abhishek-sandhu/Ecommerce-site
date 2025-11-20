const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } = require('../utils/emailService');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Valid status transitions for admin
const validStatusTransitions = {
  'pending': ['confirmed', 'cancelled'],
  'confirmed': ['shipped', 'cancelled'],
  'shipped': ['out-for-delivery', 'cancelled'],
  'out-for-delivery': ['delivered', 'cancelled'],
  'delivered': [], // Final state
  'cancelled': [] // Final state
};

// Function to validate status transition
const isValidStatusTransition = (currentStatus, newStatus) => {
  return validStatusTransitions[currentStatus]?.includes(newStatus) || false;
};

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, shippingAddress, paymentMethod, coupon, subtotal, shippingCost, taxAmount } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    let totalPrice = 0;
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      totalPrice += product.price * item.quantity;
      product.stock -= item.quantity;
      await product.save();
    }

    const order = new Order({
      user: req.user.id,
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice,
      coupon,
      subtotal,
      shippingCost,
      taxAmount,
    });

    const createdOrder = await order.save();

    // Send order confirmation email
    try {
      const user = await User.findById(req.user.id);
      await sendOrderConfirmationEmail(createdOrder, user);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the order creation if email fails
    }

    res.status(201).json(createdOrder);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;

    // Get current order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Validate status transition
    if (!isValidStatusTransition(order.status, status)) {
      return res.status(400).json({
        message: `Invalid status transition from ${order.status} to ${status}`,
        validTransitions: validStatusTransitions[order.status]
      });
    }

    // Prepare update object
    const updateData = { status };

    // If status is delivered, update delivery fields
    if (status === 'delivered') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }

    // Update order
    const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true })
      .populate('user', 'name email');

    // Send order status update email
    try {
      await sendOrderStatusUpdateEmail(updatedOrder, updatedOrder.user, status);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the status update if email fails
    }

    res.json({
      message: `Order status updated to ${status}`,
      order: updatedOrder,
      validNextStatuses: validStatusTransitions[status] || []
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createPaymentOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // amount in paisa
      currency: 'INR',
      receipt: 'receipt_' + Date.now(),
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Update order status
      const order = await Order.findOneAndUpdate(
        { 'paymentResult.id': razorpay_order_id },
        {
          isPaid: true,
          paidAt: Date.now(),
          paymentResult: {
            id: razorpay_payment_id,
            status: 'completed',
            update_time: Date.now(),
          },
        }
      );
      res.json({ message: 'Payment verified' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getOrderStatusOptions = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const currentStatus = order.status;
    const validNextStatuses = validStatusTransitions[currentStatus] || [];

    res.json({
      currentStatus,
      validNextStatuses,
      allStatuses: Object.keys(validStatusTransitions)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Export validation functions for testing
module.exports.validStatusTransitions = validStatusTransitions;
module.exports.isValidStatusTransition = isValidStatusTransition;