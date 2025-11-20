const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Cart = require('./models/Cart');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();
    await Cart.deleteMany();

    // Create admin user
    const admin = new User({
      name: 'Admin',
      email: 'admin@example.com',
      password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password: password
      role: 'admin',
    });
    await admin.save();

    // Create categories
    const electronics = new Category({ name: 'Electronics', description: 'Electronic devices' });
    const clothing = new Category({ name: 'Clothing', description: 'Fashion and apparel' });
    await electronics.save();
    await clothing.save();

    // Create products
    const products = [
      {
        name: 'iPhone 14',
        description: 'Latest iPhone with advanced features',
        price: 999,
        category: electronics._id,
        images: ['https://example.com/iphone.jpg'],
        stock: 50,
        brand: 'Apple',
      },
      {
        name: 'Samsung Galaxy S23',
        description: 'High-performance Android smartphone',
        price: 899,
        category: electronics._id,
        images: ['https://example.com/galaxy.jpg'],
        stock: 40,
        brand: 'Samsung',
      },
      {
        name: 'Nike T-Shirt',
        description: 'Comfortable cotton t-shirt',
        price: 29,
        category: clothing._id,
        images: ['https://example.com/nike.jpg'],
        stock: 100,
        brand: 'Nike',
      },
    ];

    await Product.insertMany(products);

    console.log('Data seeded successfully');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();