const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Define email options
  const mailOptions = {
    from: `"ShopHub" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmationEmail = async (order, user) => {
  const orderItemsHtml = order.orderItems.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <img src="${item.product?.image || item.image}" alt="${item.product?.name || item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px; margin-right: 10px;">
        ${item.product?.name || item.name}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.product?.price || item.price).toFixed(2)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${((item.product?.price || item.price) * item.quantity).toFixed(2)}</td>
    </tr>
  `).join('');

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Confirmation - ShopHub</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .order-details { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #ddd; }
        .total { font-weight: bold; font-size: 18px; color: #667eea; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
          <p>Thank you for shopping with ShopHub!</p>
        </div>

        <div class="content">
          <h2>Hello ${user.name},</h2>
          <p>Your order has been successfully placed! Here are the details:</p>

          <div class="order-details">
            <h3>Order #${order._id}</h3>
            <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Shipping Address:</strong><br>
            ${order.shippingAddress.street}<br>
            ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
            ${order.shippingAddress.country}</p>

            <h4>Order Items:</h4>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHtml}
              </tbody>
            </table>

            <div style="margin-top: 20px; text-align: right;">
              <p><strong>Subtotal:</strong> $${order.subtotal ? order.subtotal.toFixed(2) : order.totalPrice.toFixed(2)}</p>
              ${order.shippingCost ? `<p><strong>Shipping:</strong> $${order.shippingCost.toFixed(2)}</p>` : ''}
              ${order.taxAmount ? `<p><strong>Tax:</strong> $${order.taxAmount.toFixed(2)}</p>` : ''}
              <p class="total">Total: $${order.totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
          <p><strong>Order Status:</strong> ${order.status || 'Processing'}</p>

          <div style="background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h4>What's Next?</h4>
            <ul>
              <li>You'll receive an email when your order ships</li>
              <li>Track your order status in your account dashboard</li>
              <li>Estimated delivery: 3-5 business days</li>
            </ul>
          </div>

          <p>If you have any questions, please contact our support team at support@shophub.com or call +1 (555) 123-4567.</p>

          <div class="footer">
            <p>Thank you for choosing ShopHub!</p>
            <p>© 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation - Order #${order._id}`,
    html,
  });
};

const sendOrderStatusUpdateEmail = async (order, user, status) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Order Status Update - ShopHub</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .status { background: #e8f4fd; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Status Update</h1>
        </div>

        <div class="content">
          <h2>Hello ${user.name},</h2>

          <div class="status">
            <h3>Your order #${order._id} status has been updated</h3>
            <p style="font-size: 24px; font-weight: bold; color: #667eea; margin: 10px 0;">${status}</p>
          </div>

          <p>You can track your order and view all details in your <a href="${process.env.FRONTEND_URL}/orders" style="color: #667eea;">account dashboard</a>.</p>

          <p>If you have any questions, please contact our support team.</p>

          <div class="footer">
            <p>© 2024 ShopHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Status Update - Order #${order._id}`,
    html,
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};