import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, fetchProducts } from '../slices/productSlice';
import { addToCart } from '../slices/cartSlice';
import { createOrder } from '../slices/orderSlice';
import { Star, Heart, ZoomIn, Truck, Shield, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, loading, products } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [showAllRelated, setShowAllRelated] = useState(false);
  const [allRelatedProducts, setAllRelatedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (product && product.category) {
      const fetchRelatedProducts = async () => {
        try {
          // Fetch more related products initially
          const result = await dispatch(fetchProducts({
            category: product.category,
            limit: 12,
            page: 1
          })).unwrap();
          // Filter out the current product
          const filtered = result.products.filter(p => p._id !== product._id);
          setAllRelatedProducts(filtered);
          // Show first 8 initially
          setRelatedProducts(filtered.slice(0, 8));
        } catch (error) {
          console.error('Failed to fetch related products:', error);
        }
      };
      fetchRelatedProducts();
    }
  }, [product, dispatch]);

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await dispatch(addToCart({ productId: id, quantity })).unwrap();
      toast.success('Product added to cart!');
    } catch (error) {
      toast.error('Failed to add product to cart');
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast.error('Please login to purchase');
      navigate('/login');
      return;
    }

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      const orderData = {
        orderItems: [{
          product: id,
          name: product.name,
          image: product.images[0],
          price: product.price,
          quantity: quantity,
        }],
        shippingAddress: user.addresses?.[0] || {}, // Use first address or empty object
        paymentMethod: 'card', // Default payment method
        itemsPrice: product.price * quantity,
        taxPrice: (product.price * quantity * 0.1), // 10% tax
        shippingPrice: product.price * quantity > 50 ? 0 : 10, // Free shipping over $50
        totalPrice: product.price * quantity + (product.price * quantity * 0.1) + (product.price * quantity > 50 ? 0 : 10),
      };

      const result = await dispatch(createOrder(orderData)).unwrap();
      toast.success('Order created successfully!');
      navigate('/checkout', { state: { orderId: result._id } });
    } catch (error) {
      toast.error('Failed to create order');
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => {
    setShowZoom(true);
  };

  const handleMouseLeave = () => {
    setShowZoom(false);
  };

  const getStockStatus = () => {
    if (product.stock === 0) return { text: 'Out of Stock', color: 'text-red-600', icon: AlertCircle };
    if (product.stock <= 5) return { text: `Only ${product.stock} left`, color: 'text-orange-600', icon: AlertCircle };
    return { text: 'In Stock', color: 'text-green-600', icon: CheckCircle };
  };

  const handleShowMoreRelated = () => {
    setRelatedProducts(allRelatedProducts);
    setShowAllRelated(true);
  };

  const handleViewAllRelated = () => {
    navigate(`/products?category=${product.category}&exclude=${product._id}`);
  };

  if (loading || !product) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const stockStatus = getStockStatus();
  const StatusIcon = stockStatus.icon;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div className="space-y-4">
          {/* Main Image with Zoom */}
          <div className="relative group">
            <div className="relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={product.images[selectedImage] || '/placeholder.jpg'}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover cursor-zoom-in transition-transform duration-200"
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setIsZoomed(!isZoomed)}
              />
              {/* Zoom Lens */}
              {showZoom && (
                <div
                  className="absolute border-2 border-white shadow-lg pointer-events-none bg-white/20 backdrop-blur-sm"
                  style={{
                    width: '120px',
                    height: '120px',
                    left: `${zoomPosition.x}%`,
                    top: `${zoomPosition.y}%`,
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                  }}
                />
              )}
              {/* Zoom Button */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ZoomIn size={20} />
              </button>
            </div>

            {/* Zoom Preview */}
            {showZoom && (
              <div className="absolute top-0 left-full ml-4 w-96 h-96 bg-white border-2 border-gray-200 rounded-lg shadow-xl overflow-hidden z-10">
                <img
                  src={product.images[selectedImage] || '/placeholder.jpg'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(2) translate(${-zoomPosition.x}%, ${-zoomPosition.y}%)`,
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }}
                />
              </div>
            )}

            {/* Full Screen Zoom Modal */}
            {isZoomed && (
              <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setIsZoomed(false)}>
                <div className="relative max-w-4xl max-h-full">
                  <img
                    src={product.images[selectedImage] || '/placeholder.jpg'}
                    alt={product.name}
                    className="max-w-full max-h-full object-contain"
                  />
                  <button
                    onClick={() => setIsZoomed(false)}
                    className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                    selectedImage === index ? 'border-blue-500 shadow-md' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            {product.brand && (
              <p className="text-lg text-gray-600 mb-4">by {product.brand}</p>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={i < Math.floor(product.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="text-gray-600">({product.numReviews} reviews)</span>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue-600">${product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xl text-gray-500 line-through">${product.originalPrice}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-green-600 font-medium">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% off
              </p>
            )}
          </div>

          {/* Stock Status */}
          <div className="flex items-center gap-2">
            <StatusIcon className={stockStatus.color} size={20} />
            <span className={`font-medium ${stockStatus.color}`}>{stockStatus.text}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Key Features</h3>
              <ul className="space-y-1">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-gray-700">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">Quantity:</label>
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-16 text-center border-x py-2"
                />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-3 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 add-to-cart-btn disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Out of Stock' : 'Buy Now'}
              </button>
              <button className="wishlist-btn">
                <Heart size={20} />
              </button>
            </div>
          </div>

          {/* Shipping & Returns Info */}
          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-3 text-gray-600">
              <Truck size={20} />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Shield size={20} />
              <span>2-year warranty included</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <RotateCcw size={20} />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="mt-16 border-t pt-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Related Products</h2>
            {allRelatedProducts.length > 8 && !showAllRelated && (
              <button
                onClick={handleShowMoreRelated}
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                View More ({allRelatedProducts.length - 8} more)
              </button>
            )}
          </div>

          <div className={`grid gap-6 ${
            showAllRelated
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          }`}>
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer group"
                onClick={() => navigate(`/product/${relatedProduct._id}`)}
              >
                <div className="aspect-square overflow-hidden rounded-t-xl relative">
                  <img
                    src={relatedProduct.images[0] || '/placeholder.jpg'}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      {Math.round(((relatedProduct.originalPrice - relatedProduct.price) / relatedProduct.originalPrice) * 100)}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(relatedProduct.ratings) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">({relatedProduct.numReviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-blue-600">${relatedProduct.price}</span>
                      {relatedProduct.originalPrice && relatedProduct.originalPrice > relatedProduct.price && (
                        <span className="text-sm text-gray-500 line-through">${relatedProduct.originalPrice}</span>
                      )}
                    </div>
                    {relatedProduct.stock === 0 && (
                      <span className="text-xs text-red-600 font-medium">Out of Stock</span>
                    )}
                  </div>
                  {relatedProduct.brand && (
                    <p className="text-xs text-gray-500 mt-1">{relatedProduct.brand}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* View All Related Products Button */}
          {allRelatedProducts.length > relatedProducts.length && (
            <div className="text-center mt-8">
              <button
                onClick={handleViewAllRelated}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center gap-2"
              >
                View All Related Products
                <span className="text-sm">({allRelatedProducts.length})</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-16 border-t pt-12">
        <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
        {product.reviews.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No reviews yet.</p>
            <p className="text-sm text-gray-500">Be the first to review this product!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {product.reviews.map((review) => (
              <div key={review._id} className="bg-white p-6 rounded-xl shadow-sm border">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{review.user.name}</p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;