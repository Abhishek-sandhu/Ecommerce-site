import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchCart, updateCartItem, removeFromCart } from '../slices/cartSlice';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (itemId, quantity) => {
    if (quantity > 0) {
      dispatch(updateCartItem({ itemId, quantity }));
    }
  };

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  const totalPrice = cart.items?.reduce((total, item) => total + item.product.price * item.quantity, 0) || 0;

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      {cart.items?.length === 0 ? (
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link to="/products" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {cart.items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.product.images[0] || '/placeholder.jpg'}
                  alt={item.product.name}
                />
                <div className="details">
                  <h3>{item.product.name}</h3>
                  <p>${item.product.price}</p>
                </div>
                <div className="quantity">
                  <button onClick={() => handleQuantityChange(item._id, item.quantity - 1)}>-</button>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                  />
                  <button onClick={() => handleQuantityChange(item._id, item.quantity + 1)}>+</button>
                </div>
                <button
                  onClick={() => handleRemoveItem(item._id)}
                  className="remove-btn"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$10.00</span>
            </div>
            <div className="total">
              <span>Total:</span>
              <span>${(totalPrice + 10).toFixed(2)}</span>
            </div>
            <Link
              to="/checkout"
              className="btn"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;