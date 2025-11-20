import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../slices/productSlice';
import ProductCard from '../components/ProductCard';
import { Star, Truck, Shield, Headphones, ChevronRight, Zap, Award, Users } from 'lucide-react';

const Home = () => {
  const dispatch = useDispatch();
  const { products, categories, loading } = useSelector((state) => state.products);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 20 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      // Get featured products (highest rated)
      const featured = [...products]
        .sort((a, b) => b.ratings - a.ratings)
        .slice(0, 4);
      setFeaturedProducts(featured);

      // Get new arrivals (most recent)
      const newArrivalsData = [...products]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 4);
      setNewArrivals(newArrivalsData);
    }
  }, [products]);

  const heroSlides = [
    {
      title: "Welcome to ShopHub",
      subtitle: "Discover amazing products at unbeatable prices",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=500&fit=crop",
      cta: "Shop Now",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    },
    {
      title: "New Arrivals Daily",
      subtitle: "Stay ahead with the latest trends and innovations",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop",
      cta: "Explore New",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
    },
    {
      title: "Quality Guaranteed",
      subtitle: "Premium products with exceptional customer service",
      image: "https://images.unsplash.com/photo-1556745757-8d76bdb6984b?w=1200&h=500&fit=crop",
      cta: "Learn More",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Users, value: "50K+", label: "Happy Customers" },
    { icon: Award, value: "10K+", label: "Products" },
    { icon: Zap, value: "25K+", label: "Orders Delivered" },
    { icon: Star, value: "4.8", label: "Average Rating" }
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroSlides[currentSlide].image}
            alt={heroSlides[currentSlide].title}
            className="w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: heroSlides[currentSlide].gradient, opacity: 0.7 }}
          ></div>
        </div>

        <div className="relative z-10 flex items-center justify-center h-full text-white">
          <div className="text-center max-w-4xl px-4">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-xl lg:text-2xl mb-8 opacity-90">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
            >
              {heroSlides[currentSlide].cta}
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <IconComponent className="text-blue-600" size={24} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories and find exactly what you're looking for
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/products?category=${category._id}`}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center hover:transform hover:scale-105"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                  <span className="text-2xl">📦</span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              View All Categories
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
              <p className="text-gray-600">Discover our most popular and highly-rated items</p>
            </div>
            <Link
              to="/products?sort=rating"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="loading"></div>
              </div>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">New Arrivals</h2>
              <p className="text-gray-600">Be the first to explore our latest additions</p>
            </div>
            <Link
              to="/products?sort=newest"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View All
              <ChevronRight size={16} />
            </Link>
          </div>

          <div className="product-grid">
            {loading ? (
              <div className="col-span-full flex justify-center py-12">
                <div className="loading"></div>
              </div>
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ShopHub?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing the best shopping experience with quality products and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Truck className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Free Shipping</h3>
              <p className="text-gray-600">
                Enjoy free shipping on all orders over $50. Fast and reliable delivery to your doorstep.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
                <Shield className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Secure Payment</h3>
              <p className="text-gray-600">
                Your payment information is protected with bank-level security. Multiple payment options available.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-6">
                <Headphones className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">24/7 Support</h3>
              <p className="text-gray-600">
                Our customer support team is here to help you with any questions or concerns, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl mb-8 opacity-90">
            Subscribe to our newsletter for exclusive deals and new product announcements
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;