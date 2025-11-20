import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder, createPaymentOrder } from '../slices/orderSlice';
import { clearCart } from '../slices/cartSlice';
import { applyCoupon, clearCoupon } from '../slices/couponSlice';
import toast from 'react-hot-toast';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { coupon, discount, loading: couponLoading } = useSelector((state) => state.coupons);

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [couponCode, setCouponCode] = useState('');

  const totalPrice = cart.items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;
  const shippingCost = totalPrice > 50 ? 0 : 10;
  const taxRate = 0.08; // 8% tax
  const taxAmount = totalPrice * taxRate;
  const subtotal = totalPrice + shippingCost + taxAmount;
  const finalTotal = Math.max(0, subtotal - discount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }

    try {
      await dispatch(applyCoupon({ code: couponCode.trim(), orderTotal: subtotal })).unwrap();
      toast.success('Coupon applied successfully!');
      setCouponCode('');
    } catch (error) {
      toast.error(error || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearCoupon());
    toast.success('Coupon removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      orderItems: cart.items.map(item => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.images[0],
      })),
      shippingAddress,
      paymentMethod,
      totalPrice: finalTotal,
      subtotal: totalPrice,
      shippingCost,
      taxAmount,
      discount,
      coupon: coupon ? { code: coupon.code, discount } : null,
    };

    try {
      if (paymentMethod === 'razorpay') {
        const paymentOrder = await dispatch(createPaymentOrder(finalTotal)).unwrap();
        // Integrate Razorpay payment here
        // For now, just create the order
        await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        toast.success('Order placed successfully');
        navigate('/orders');
      } else {
        await dispatch(createOrder(orderData)).unwrap();
        dispatch(clearCart());
        toast.success('Order placed successfully');
        navigate('/orders');
      }
    } catch (error) {
      toast.error('Failed to place order');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Street Address"
              value={shippingAddress.street}
              onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              onChange={(e) => setShippingAddress({ ...shippingAddress, state: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              placeholder="ZIP Code"
              value={shippingAddress.zip}
              onChange={(e) => setShippingAddress({ ...shippingAddress, zip: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              className="w-full p-3 border rounded"
              required
            />
          </div>
          <h2 className="text-xl font-semibold mb-4 mt-8">Payment Method</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Razorpay
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              Cash on Delivery
            </label>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            {cart.items?.map((item) => (
              <div key={item._id} className="flex justify-between mb-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.images[0] || '/placeholder.jpg'}
                    alt={item.product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{item.product.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-medium text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}

            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal:</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Shipping:</span>
                <span className={shippingCost === 0 ? 'text-green-600' : ''}>
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              {shippingCost === 0 && (
                <p className="text-xs text-green-600">Free shipping on orders over $50</p>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Tax (8%):</span>
                <span>${taxAmount.toFixed(2)}</span>
              </div>

              {/* Coupon Section */}
              {!coupon ? (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="flex-1 p-2 border rounded text-sm"
                      disabled={couponLoading}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center text-green-600">
                    <span>Coupon ({coupon.code}):</span>
                    <div className="flex items-center gap-2">
                      <span>-${discount.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  {coupon.description && (
                    <p className="text-xs text-gray-500 mt-1">{coupon.description}</p>
                  )}
                </div>
              )}

              <div className="flex justify-between font-bold text-lg text-gray-900 border-t border-gray-300 pt-2">
                <span>Total:</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full btn mt-6"
          >
            Complete Order - ${finalTotal.toFixed(2)}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;