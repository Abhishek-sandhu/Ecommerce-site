import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Heart } from 'lucide-react';
import { addToCart } from '../slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    const isInWishlist = wishlist.products?.some(p => p._id === product._id);

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(product._id)).unwrap();
        toast.success('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(product._id)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const isInWishlist = wishlist.products?.some(p => p._id === product._id);
  return (
    <div className="product-card">
      <img
        src={product.images[0] || '/placeholder.jpg'}
        alt={product.name}
      />
      <div className="content">
        <h3>
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <div className="rating">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                fill={i < Math.floor(product.ratings) ? 'currentColor' : 'none'}
              />
            ))}
          </div>
          <span className="reviews">({product.numReviews})</span>
        </div>
        <p className="price">${product.price}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
          <button
            style={{
              color: isInWishlist ? '#e53e3e' : '#666',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
            onClick={handleWishlistToggle}
          >
            <Heart size={20} fill={isInWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;