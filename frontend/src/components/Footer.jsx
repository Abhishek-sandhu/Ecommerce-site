import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MessageCircle, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div>
          <h3>E-Commerce</h3>
          <p className="text-gray-300 mb-4">
            Your one-stop shop for all your needs. Quality products, exceptional service, and unbeatable prices.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Facebook">
              <Facebook size={20} />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter size={20} />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram size={20} />
            </a>
            <a href="#" aria-label="YouTube">
              <Youtube size={20} />
            </a>
          </div>
        </div>

        <div>
          <h3>Quick Links</h3>
          <Link to="/products">Products</Link>
          <Link to="/categories">Categories</Link>
          <Link to="/deals">Special Deals</Link>
          <Link to="/new-arrivals">New Arrivals</Link>
        </div>

        <div>
          <h3>Customer Service</h3>
          <Link to="/orders">My Orders</Link>
          <Link to="/returns">Returns & Exchanges</Link>
          <Link to="/shipping">Shipping Info</Link>
          <Link to="/faq">FAQ</Link>
        </div>

        <div>
          <h3>Contact Us</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone size={16} className="text-blue-400" />
              <div>
                <p className="font-medium">Phone Support</p>
                <p className="text-sm text-gray-300">+1 (555) 123-4567</p>
                <p className="text-xs text-gray-400">Mon-Fri: 9AM-6PM EST</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={16} className="text-blue-400" />
              <div>
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-gray-300">support@shophub.com</p>
                <p className="text-xs text-gray-400">24/7 response within 2 hours</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MessageCircle size={16} className="text-blue-400" />
              <div>
                <p className="font-medium">Live Chat</p>
                <p className="text-sm text-gray-300">Available 24/7</p>
                <p className="text-xs text-gray-400">Average response: 30 seconds</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-blue-400" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-sm text-gray-300">123 Commerce St<br />New York, NY 10001</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bottom">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; 2024 ShopHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/privacy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-blue-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;