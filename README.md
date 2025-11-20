# E-Commerce Website

A full-stack E-Commerce website built with MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### User Panel
- Home page with featured products
- Product listing with search, filter, and sort
- Product details page
- Shopping cart functionality
- Wishlist
- User authentication (JWT)
- Checkout process
- Order history
- User profile management
- Product reviews and ratings
- Razorpay payment integration (test mode)

### Admin Panel
- Admin dashboard with analytics
- Manage products (CRUD)
- Manage orders and update status
- Manage categories
- Manage coupons
- User management

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Razorpay for payments
- bcryptjs for password hashing

### Frontend
- React with Vite
- Redux Toolkit for state management
- React Router for routing
- Tailwind CSS for styling
- Axios for API calls
- React Hot Toast for notifications

## Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

## Setup

1. Create a MongoDB database (local or cloud)
2. Update the `.env` file in the backend directory with your configuration:
   ```
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```
3. Seed the database with sample data:
   ```bash
   cd backend
   node seeder.js
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
2. Start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

The application will be running at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Default Admin Credentials

- Email: admin@example.com
- Password: password

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/profile - Get user profile
- PUT /api/auth/profile - Update user profile

### Products
- GET /api/products - Get all products (with filters)
- GET /api/products/:id - Get single product
- POST /api/products/:id/reviews - Add product review
- GET /api/products/categories - Get all categories

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/item/:itemId - Update cart item quantity
- DELETE /api/cart/item/:itemId - Remove item from cart

### Orders
- POST /api/orders - Create new order
- GET /api/orders/myorders - Get user's orders
- GET /api/orders/:id - Get single order
- POST /api/orders/payment/create - Create Razorpay payment order
- POST /api/orders/payment/verify - Verify Razorpay payment

### Admin
- GET /api/admin/dashboard - Get dashboard stats
- GET /api/admin/users - Get all users
- GET /api/admin/coupons - Get all coupons
- POST /api/admin/coupons - Create coupon
- PUT /api/admin/coupons/:id - Update coupon
- DELETE /api/admin/coupons/:id - Delete coupon
- GET /api/admin - Get all orders
- PUT /api/admin/:id/status - Update order status

## Project Structure

```
ecommerce/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── server.js
│   ├── seeder.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── slices/
    │   ├── App.jsx
    │   └── main.jsx
    ├── public/
    └── package.json
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.