import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../slices/authSlice';
import { ShoppingCart, User, LogOut, Menu } from 'lucide-react';

const Header = () => {
  const { user } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const toggleMobileMenu = () => {
    const mobileNav = document.querySelector('.mobile-nav');
    mobileNav.classList.toggle('active');
  };

  return (
    <header className="navbar">
      <div className="container">
        <Link to="/" className="logo">
          E-Commerce
        </Link>
        <nav className="nav-links">
          <Link to="/products">Products</Link>
          {user ? (
            <>
              <Link to="/cart" className="cart-icon">
                <ShoppingCart size={24} />
                {cart.items?.length > 0 && (
                  <span className="cart-count">{cart.items.length}</span>
                )}
              </Link>
              <Link to="/profile">
                <User size={24} />
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin">Admin</Link>
              )}
              <button onClick={handleLogout}>
                <LogOut size={24} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn">Register</Link>
            </>
          )}
        </nav>
        <div className="hamburger" onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="mobile-nav">
        <nav className="nav-links">
          <Link to="/products" onClick={toggleMobileMenu}>Products</Link>
          {user ? (
            <>
              <Link to="/cart" onClick={toggleMobileMenu}>
                <ShoppingCart size={24} />
                Cart ({cart.items?.length || 0})
              </Link>
              <Link to="/profile" onClick={toggleMobileMenu}>
                <User size={24} />
                Profile
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" onClick={toggleMobileMenu}>Admin</Link>
              )}
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }}>
                <LogOut size={24} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMobileMenu}>Login</Link>
              <Link to="/register" onClick={toggleMobileMenu} className="btn">Register</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;