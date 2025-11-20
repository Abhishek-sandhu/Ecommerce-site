# 🛍️ Professional E-Commerce Platform

A comprehensive full-stack E-Commerce website built with MERN stack (MongoDB, Express.js, React, Node.js) featuring professional-level shopping experience with advanced functionalities.

![E-Commerce Platform](https://img.shields.io/badge/MERN-Stack-blue)
![Version](https://img.shields.io/badge/Version-2.0.0-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Key Features

### 🛒 **Advanced Shopping Experience**
- **Professional Product Image Zoom** - Hover lens effect with full-screen modal zoom
- **Buy Now Button** - Direct purchase without adding to cart
- **Enhanced Related Products** - Smart recommendations with category-based suggestions
- **Professional Price Range Slider** - Interactive dual-range filtering
- **Complete Coupons System** - Percentage and fixed amount discounts with validation
- **Real Product Images** - 100+ authentic category-specific images from Unsplash

### 👤 **User Panel**
- **Modern Home Page** with featured products and categories
- **Advanced Product Listing** with search, filter, sort, and price range filtering
- **Detailed Product Pages** with zoom, reviews, and related products
- **Smart Shopping Cart** with quantity management and persistence
- **Wishlist Functionality** for saving favorite products
- **Secure JWT Authentication** with email/password login
- **Multiple Address Management** for delivery preferences
- **Streamlined Checkout Process** with coupon application
- **Order History & Tracking** with detailed order information
- **User Profile Management** with address and personal info
- **Product Reviews & Ratings** system
- **Razorpay Payment Integration** (test mode)

### 👨‍💼 **Admin Panel**
- **Comprehensive Dashboard** with sales analytics and insights
- **Complete Product Management** (CRUD operations)
- **Order Management** with status updates and tracking
- **Category Management** for product organization
- **Advanced Coupons Manager** with usage limits and validation
- **User Management** with role-based access
- **Sales Reports** and business intelligence

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** with Mongoose** - NoSQL database
- **JWT** - JSON Web Token for authentication
- **Razorpay** - Payment gateway integration
- **bcryptjs** - Password hashing
- **Nodemailer** - Email services
- **CORS** - Cross-origin resource sharing

### Frontend
- **React 18** with Vite - Modern frontend framework
- **Redux Toolkit** - State management
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls
- **React Hot Toast** - Notification system
- **React Icons** - Icon library
- **Lucide React** - Additional icons

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Abhishek-sandhu/Ecommerce-site.git
   cd Ecommerce-site
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Environment Variables**
   Create `.env` file in the backend directory:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

2. **Database Seeding**
   ```bash
   cd backend
   node seeder.js
   ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

**Access URLs:**
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:5001

## 👤 Default Credentials

### Admin Access
- **Email:** admin@example.com
- **Password:** password

### Sample User
- **Email:** user@example.com
- **Password:** password

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get products with filters
- `GET /api/products/:id` - Get single product
- `POST /api/products/:id/reviews` - Add product review
- `GET /api/products/categories` - Get categories

### Cart & Wishlist
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/item/:itemId` - Update cart item
- `DELETE /api/cart/item/:itemId` - Remove from cart
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist/add` - Add to wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/cancel` - Cancel order
- `POST /api/orders/payment/create` - Create payment
- `POST /api/orders/payment/verify` - Verify payment

### Coupons
- `POST /api/coupons/validate` - Validate coupon
- `POST /api/coupons/apply` - Apply coupon to order

### Admin
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - User management
- `GET /api/admin/products` - Product management
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Order management
- `PUT /api/admin/orders/:id/status` - Update order status
- `GET /api/admin/coupons` - Coupon management
- `POST /api/admin/coupons` - Create coupon
- `PUT /api/admin/coupons/:id` - Update coupon
- `DELETE /api/admin/coupons/:id` - Delete coupon

## 🏗️ Project Structure

```
ecommerce-platform/
├── backend/
│   ├── controllers/          # Business logic
│   ├── models/              # Database schemas
│   ├── routes/              # API endpoints
│   ├── middleware/          # Custom middleware
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── seeder.js            # Database seeding
│   ├── server.js            # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── slices/         # Redux slices
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # App entry point
│   ├── public/             # Static assets
│   └── package.json
└── README.md
```

## 🎨 Features Showcase

### 🖼️ **Advanced Product Zoom**
- Hover over product images for magnified view
- Circular lens effect follows cursor
- Full-screen modal zoom on click
- Smooth animations and transitions

### 🏷️ **Smart Coupons System**
- Percentage and fixed amount discounts
- Minimum purchase requirements
- Usage limits and expiration dates
- Real-time validation and application

### 📦 **Enhanced Product Discovery**
- Category-based related products
- Price range filtering with slider
- Advanced search and sorting
- Authentic product photography

### 💳 **Streamlined Checkout**
- Multiple address management
- Coupon code application
- Order summary with discounts
- Secure payment processing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Unsplash** for providing high-quality product images
- **React Icons** for the icon library
- **Tailwind CSS** for the styling framework
- **MongoDB** for the database solution

## 📞 Support

For support, email support@ecommerce-platform.com or create an issue in this repository.

---

**Made with ❤️ using MERN Stack**
