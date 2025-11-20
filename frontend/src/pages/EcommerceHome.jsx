import React, { useState, useEffect } from 'react';
import { FaSearch, FaShoppingCart, FaUser, FaBars, FaMapMarkerAlt, FaStar, FaStarHalfAlt, FaHeart, FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaMobileAlt, FaLaptop, FaTshirt, FaHome, FaBook, FaGamepad, FaChevronLeft, FaChevronRight, FaFire, FaBolt, FaCrown, FaTag, FaTruck, FaShieldAlt, FaHeadphones, FaCreditCard, FaStore, FaGift, FaShippingFast, FaAward, FaUsers, FaRocket, FaMagic, FaShoppingBag, FaClock, FaCheckCircle, FaPlus } from 'react-icons/fa';
import './EcommerceHome.css';

const EcommerceHome = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [animatedStats, setAnimatedStats] = useState({ customers: 0, products: 0, orders: 0, satisfaction: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [isTyping, setIsTyping] = useState(true);

  const toggleWishlist = (productId) => {
    const newWishlist = new Set(wishlistItems);
    if (newWishlist.has(productId)) {
      newWishlist.delete(productId);
    } else {
      newWishlist.add(productId);
    }
    setWishlistItems(newWishlist);
  };

  // Animated typing effect for hero text
  const heroTexts = [
    "Welcome to ShopHub",
    "Discover Amazing Products",
    "Unbeatable Prices Await",
    "Quality You Can Trust"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTyping(false);
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % heroTexts.length);
        setIsTyping(true);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animated statistics counter
  useEffect(() => {
    const targetStats = { customers: 50000, products: 10000, orders: 25000, satisfaction: 98 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedStats({
        customers: Math.floor(targetStats.customers * progress),
        products: Math.floor(targetStats.products * progress),
        orders: Math.floor(targetStats.orders * progress),
        satisfaction: Math.floor(targetStats.satisfaction * progress)
      });

      if (currentStep >= steps) {
        clearInterval(timer);
        setAnimatedStats(targetStats);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const heroSlides = [
    {
      id: 1,
      title: heroTexts[currentText],
      subtitle: "Discover amazing products at unbeatable prices with lightning-fast delivery",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&h=400&fit=crop",
      cta: "Start Shopping",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      icon: FaRocket
    },
    {
      id: 2,
      title: "Flash Sale Alert!",
      subtitle: "Limited time offers on premium products - up to 70% off",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop",
      cta: "Shop Deals",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      icon: FaBolt
    },
    {
      id: 3,
      title: "New Arrivals Daily",
      subtitle: "Explore the latest trends and innovations in tech & fashion",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop",
      cta: "Browse New",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: FaMagic
    }
  ];

  const deals = [
    {
      id: 1,
      title: "Daily Deal",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop",
      discount: "50%",
      originalPrice: 5999,
      currentPrice: 2999,
      timeLeft: "12h 34m"
    },
    {
      id: 2,
      title: "Hot Deal",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop",
      discount: "30%",
      originalPrice: 29999,
      currentPrice: 20999,
      timeLeft: "2h 15m"
    },
    {
      id: 3,
      title: "Special Offer",
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop",
      discount: "20%",
      originalPrice: 3499,
      currentPrice: 2799,
      timeLeft: "8h 42m"
    },
    {
      id: 4,
      title: "Value Pack",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop",
      discount: "25%",
      originalPrice: 4999,
      currentPrice: 3749,
      timeLeft: "16h 20m"
    }
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Premium Wireless Headphones',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 2341,
      currentPrice: 2999,
      originalPrice: 5999,
      discount: 50,
      badge: 'Best Seller'
    },
    {
      id: 2,
      name: 'Smart Fitness Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
      rating: 5,
      reviews: 1892,
      currentPrice: 24999,
      originalPrice: 29999,
      discount: 17,
      badge: 'Trending'
    },
    {
      id: 3,
      name: 'Bluetooth Speaker Pro',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 3456,
      currentPrice: 1999,
      originalPrice: 3499,
      discount: 43,
      badge: 'Popular'
    },
    {
      id: 4,
      name: 'Travel Backpack',
      image: 'https://images.unsplash.com/photo-1541963463532-d68292c34d19?w=300&h=300&fit=crop',
      rating: 5,
      reviews: 987,
      currentPrice: 1499,
      originalPrice: 2499,
      discount: 40,
      badge: 'Customer Favorite'
    },
    {
      id: 5,
      name: 'Gaming Mechanical Keyboard',
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 1234,
      currentPrice: 3499,
      originalPrice: 4999,
      discount: 30,
      badge: 'New Arrival'
    },
    {
      id: 6,
      name: 'Professional Camera',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=300&fit=crop',
      rating: 5,
      reviews: 756,
      currentPrice: 18999,
      originalPrice: 24999,
      discount: 24,
      badge: 'Premium'
    }
  ];

  const categories = [
    { name: 'Electronics', icon: FaBolt, color: '#FF6B6B', description: 'Latest gadgets & tech' },
    { name: 'Fashion', icon: FaTshirt, color: '#4ECDC4', description: 'Style & apparel' },
    { name: 'Home & Living', icon: FaHome, color: '#45B7D1', description: 'Home essentials' },
    { name: 'Sports', icon: FaAward, color: '#96CEB4', description: 'Fitness & outdoor' },
    { name: 'Books', icon: FaBook, color: '#FFEAA7', description: 'Knowledge & learning' },
    { name: 'Beauty', icon: FaCrown, color: '#DDA0DD', description: 'Personal care' },
    { name: 'Automotive', icon: FaShippingFast, color: '#98D8C8', description: 'Car accessories' },
    { name: 'Gifts', icon: FaGift, color: '#F7DC6F', description: 'Perfect presents' }
  ];

  const services = [
    {
      icon: FaTruck,
      title: 'Free Shipping',
      description: 'Free delivery on orders over ₹499',
      color: '#FF6B6B'
    },
    {
      icon: FaShieldAlt,
      title: 'Secure Payment',
      description: '100% secure checkout process',
      color: '#4ECDC4'
    },
    {
      icon: FaHeadphones,
      title: '24/7 Support',
      description: 'Round the clock customer care',
      color: '#45B7D1'
    },
    {
      icon: FaCreditCard,
      title: 'Easy Returns',
      description: 'Hassle-free return policy',
      color: '#96CEB4'
    },
    {
      icon: FaAward,
      title: 'Quality Assured',
      description: 'Genuine products guarantee',
      color: '#FFEAA7'
    },
    {
      icon: FaUsers,
      title: 'Community',
      description: 'Join millions of happy customers',
      color: '#DDA0DD'
    }
  ];

  const sponsoredProducts = [
    {
      id: 1,
      name: 'Premium Headphones',
      image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&h=200&fit=crop',
      rating: 4.5,
      reviews: 1234,
      price: 2499,
      badge: 'Sponsored',
      prime: true
    },
    {
      id: 2,
      name: 'Smart Watch',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=200&fit=crop',
      rating: 4.8,
      reviews: 987,
      price: 15999,
      badge: 'Sponsored',
      prime: false
    }
  ];

  const recentlyViewed = [
    {
      id: 1,
      name: 'Wireless Earbuds',
      image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&h=100&fit=crop',
      price: 1999
    },
    {
      id: 2,
      name: 'Phone Case',
      image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=100&h=100&fit=crop',
      price: 499
    },
    {
      id: 3,
      name: 'Power Bank',
      image: 'https://images.unsplash.com/photo-1609594040430-3b9fe3259e5f?w=100&h=100&fit=crop',
      price: 1299
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={i} />);
    }

    if (hasHalfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }

    return stars;
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <div className="ecommerce-home">
      {/* Header */}
      <header className="header">
        <div className="header-top">
          <div className="container">
            <div className="header-top-content">
              <div className="location">
                <FaMapMarkerAlt />
                <span>Deliver to India</span>
              </div>
              <div className="header-links">
                <a href="#" className="header-link">Hello, Sign in</a>
                <a href="#" className="header-link">Returns & Orders</a>
                <a href="#" className="header-link">Cart</a>
              </div>
            </div>
          </div>
        </div>

        <div className="header-main">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <FaStore className="logo-icon" />
                <span className="logo-text">ShopHub</span>
              </div>

              <div className="search-bar">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="category-select"
                >
                  <option value="All">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home & Kitchen</option>
                  <option value="Books">Books</option>
                </select>
                <input
                  type="text"
                  placeholder="Search for products, brands and more..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">
                  <FaSearch />
                </button>
              </div>

              <div className="header-actions">
                <button className="action-btn">
                  <FaUser />
                  <span>Account</span>
                </button>
                <button className="action-btn cart-btn">
                  <FaShoppingCart />
                  <span className="cart-count">0</span>
                </button>
                <button className="menu-btn">
                  <FaBars />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="nav-categories">
          <div className="container">
            <button className="nav-trigger">
              <FaBars />
              <span>All</span>
            </button>
            <div className="nav-links">
              <a href="#">Today's Deals</a>
              <a href="#">Customer Service</a>
              <a href="#">Registry</a>
              <a href="#">Gift Cards</a>
              <a href="#">Sell</a>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section - Amazon Style */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-main">
            <div className="hero-left">
              <div className="hero-content-wrapper">
                <h1 className="hero-title">
                  {heroTexts[currentText]}
                  <span className="cursor">|</span>
                </h1>
                <p className="hero-subtitle">
                  Discover millions of products with fast, free delivery and easy returns
                </p>
                <div className="hero-features">
                  <div className="feature-item">
                    <FaTruck className="feature-icon" />
                    <span>Free Delivery</span>
                  </div>
                  <div className="feature-item">
                    <FaShieldAlt className="feature-icon" />
                    <span>Secure Payment</span>
                  </div>
                  <div className="feature-item">
                    <FaAward className="feature-icon" />
                    <span>Best Prices</span>
                  </div>
                </div>
                <button className="hero-cta-btn">
                  <FaShoppingBag />
                  Start Shopping
                </button>
              </div>
            </div>
            <div className="hero-right">
              <div className="hero-carousel">
                <div className="hero-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                  {heroSlides.map((slide, index) => (
                    <div key={slide.id} className="hero-slide">
                      <img src={slide.image} alt={slide.title} />
                      <div className="slide-overlay">
                        <div className="slide-content">
                          <h3>{slide.title}</h3>
                          <p>{slide.subtitle}</p>
                          <button className="slide-btn">{slide.cta}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="carousel-controls">
                  <button className="carousel-btn prev" onClick={prevSlide}>
                    <FaChevronLeft />
                  </button>
                  <div className="carousel-dots">
                    {heroSlides.map((_, index) => (
                      <button
                        key={index}
                        className={`dot ${index === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                  <button className="carousel-btn next" onClick={nextSlide}>
                    <FaChevronRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="promo-banners">
        <div className="container">
          <div className="banners-grid">
            <div className="banner-card">
              <div className="banner-content">
                <h3>Free Delivery</h3>
                <p>On orders over ₹499</p>
                <FaTruck className="banner-icon" />
              </div>
            </div>
            <div className="banner-card">
              <div className="banner-content">
                <h3>Easy Returns</h3>
                <p>30-day return policy</p>
                <FaShieldAlt className="banner-icon" />
              </div>
            </div>
            <div className="banner-card">
              <div className="banner-content">
                <h3>Secure Payment</h3>
                <p>100% secure checkout</p>
                <FaCreditCard className="banner-icon" />
              </div>
            </div>
            <div className="banner-card">
              <div className="banner-content">
                <h3>24/7 Support</h3>
                <p>Customer service always</p>
                <FaHeadphones className="banner-icon" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Statistics Section */}
      <section className="stats-section animate-on-scroll">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-icon">
                <FaUsers />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedStats.customers.toLocaleString()}+</div>
                <div className="stat-label">Happy Customers</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaStore />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedStats.products.toLocaleString()}+</div>
                <div className="stat-label">Products Available</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaShoppingBag />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedStats.orders.toLocaleString()}+</div>
                <div className="stat-label">Orders Delivered</div>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon">
                <FaAward />
              </div>
              <div className="stat-content">
                <div className="stat-number">{animatedStats.satisfaction}%</div>
                <div className="stat-label">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Section with Enhanced Animations */}
      <section className="deals-section animate-on-scroll">
        <div className="container">
          <div className="section-header">
            <div className="section-icon">
              <FaFire />
            </div>
            <h2>Today's Best Deals</h2>
            <p>Limited time offers - Don't miss out!</p>
            <a href="#" className="view-all">
              <FaBolt />
              View All Deals
            </a>
          </div>
          <div className="deals-grid">
            {deals.map((deal, index) => (
              <div key={deal.id} className="deal-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="deal-image">
                  <img src={deal.image} alt={deal.title} />
                  <div className="deal-badge pulse">{deal.discount} OFF</div>
                  <div className="deal-timer-overlay">
                    <FaClock />
                    <span>{deal.timeLeft}</span>
                  </div>
                </div>
                <div className="deal-info">
                  <h3>{deal.title}</h3>
                  <div className="deal-pricing">
                    <span className="deal-current">₹{deal.currentPrice.toLocaleString()}</span>
                    <span className="deal-original">₹{deal.originalPrice.toLocaleString()}</span>
                  </div>
                  <div className="deal-progress">
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${Math.random() * 80 + 20}%` }}></div>
                    </div>
                    <span className="progress-text">Limited Stock</span>
                  </div>
                  <button className="deal-btn">
                    <FaBolt />
                    Grab Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <p>Explore our wide range of product categories</p>
          </div>
          <div className="categories-grid">
            {categories.map((category, index) => (
              <div key={index} className="category-card">
                <div className="category-icon" style={{ backgroundColor: category.color }}>
                  <category.icon />
                </div>
                <div className="category-content">
                  <div className="category-name">{category.name}</div>
                  <div className="category-description">{category.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose ShopHub?</h2>
            <p>Experience shopping like never before</p>
          </div>
          <div className="services-grid">
            {services.map((service, index) => (
              <div key={index} className="service-card">
                <div className="service-icon" style={{ color: service.color }}>
                  <service.icon />
                </div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="products-section">
        <div className="container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <a href="#" className="view-all">View All Products</a>
          </div>

          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img src={product.image} alt={product.name} className="product-image" />
                  {product.badge && <div className="product-badge">{product.badge}</div>}
                  <div className="product-actions">
                    <button
                      className="action-btn wishlist-btn"
                      onClick={() => toggleWishlist(product.id)}
                    >
                      <FaHeart className={wishlistItems.has(product.id) ? 'active' : ''} />
                    </button>
                    <button className="action-btn quick-view-btn">
                      <FaSearch />
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-rating">
                    <div className="stars">
                      {renderStars(product.rating)}
                    </div>
                    <span className="rating-count">({product.reviews.toLocaleString()})</span>
                  </div>
                  <div className="product-price">
                    <div className="price-row">
                      <span className="current-price">₹{product.currentPrice.toLocaleString()}</span>
                      <span className="original-price">₹{product.originalPrice.toLocaleString()}</span>
                    </div>
                    <span className="discount">({product.discount}% off)</span>
                  </div>
                  <div className="product-delivery">
                    <FaTruck className="delivery-icon" />
                    <span>Free delivery</span>
                  </div>
                  <button className="add-to-cart-btn">
                    <FaShoppingCart />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Action Buttons */}
      <div className="floating-actions">
        <button className="fab main-fab">
          <FaPlus />
        </button>
        <button className="fab fab-item fab-cart">
          <FaShoppingCart />
        </button>
        <button className="fab fab-item fab-wishlist">
          <FaHeart />
        </button>
        <button className="fab fab-item fab-support">
          <FaHeadphones />
        </button>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>About ShopHub</h3>
              <ul>
                <li><a href="#">Our Story</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Press</a></li>
                <li><a href="#">Investors</a></li>
                <li><a href="#">Corporate Sales</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Customer Service</h3>
              <ul>
                <li><a href="#">Contact Us</a></li>
                <li><a href="#">Shipping Info</a></li>
                <li><a href="#">Returns</a></li>
                <li><a href="#">Size Guide</a></li>
                <li><a href="#">Gift Cards</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Shopping</h3>
              <ul>
                <li><a href="#">Store Locator</a></li>
                <li><a href="#">Track Order</a></li>
                <li><a href="#">Wishlist</a></li>
                <li><a href="#">Gift Registry</a></li>
                <li><a href="#">ShopHub Credit</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Connect With Us</h3>
              <ul>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">Twitter</a></li>
                <li><a href="#">YouTube</a></li>
                <li><a href="#">Newsletter</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-logo">
              <FaStore />
              ShopHub
            </div>
            <div className="social-links">
              <a href="#"><FaFacebookF /></a>
              <a href="#"><FaTwitter /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaYoutube /></a>
            </div>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
            <div className="copyright">
              © 2025 ShopHub. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default EcommerceHome;