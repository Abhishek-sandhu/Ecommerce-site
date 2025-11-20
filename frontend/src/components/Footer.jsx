import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h3>E-Commerce</h3>
          <p>Your one-stop shop for all your needs.</p>
        </div>
        <div>
          <h3>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/orders">Orders</a></li>
          </ul>
        </div>
        <div>
          <h3>Contact</h3>
          <p>Email: support@ecommerce.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      <div className="bottom">
        <p>&copy; 2024 E-Commerce. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;