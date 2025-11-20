const mongoose = require('mongoose');
const Product = require('./models/Product');

async function checkProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    const products = await Product.find({}).select('name category images');
    console.log('Found', products.length, 'products:');
    products.forEach((p, i) => {
      console.log(`${i+1}. ${p.name} - Category: ${p.category} - Images: ${p.images.join(', ')}`);
    });
    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  }
}

checkProducts();