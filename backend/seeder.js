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
    const categories = [
      { name: 'Electronics', description: 'Electronic devices and gadgets' },
      { name: 'Clothing', description: 'Fashion and apparel' },
      { name: 'Home & Kitchen', description: 'Home appliances and kitchenware' },
      { name: 'Books', description: 'Books and literature' },
      { name: 'Sports & Outdoors', description: 'Sports equipment and outdoor gear' },
      { name: 'Beauty & Personal Care', description: 'Cosmetics and personal care products' },
      { name: 'Toys & Games', description: 'Toys and games for all ages' },
      { name: 'Automotive', description: 'Car parts and accessories' },
      { name: 'Health & Household', description: 'Health products and household essentials' },
      { name: 'Grocery', description: 'Food and grocery items' },
    ];

    const savedCategories = await Category.insertMany(categories);

    // Create 100 products
    const products = [];
    const categoryMap = {};
    savedCategories.forEach(cat => {
      categoryMap[cat.name] = cat._id;
    });

    // Electronics products
    const electronicsProducts = [
      { name: 'iPhone 15 Pro', description: 'Latest iPhone with titanium design', price: 1199, brand: 'Apple', stock: 25 },
      { name: 'Samsung Galaxy S24', description: 'Flagship Android smartphone', price: 999, brand: 'Samsung', stock: 30 },
      { name: 'MacBook Pro 16"', description: 'Powerful laptop for professionals', price: 2499, brand: 'Apple', stock: 15 },
      { name: 'Dell XPS 13', description: 'Ultra-portable laptop', price: 1299, brand: 'Dell', stock: 20 },
      { name: 'Sony WH-1000XM5', description: 'Premium noise-cancelling headphones', price: 399, brand: 'Sony', stock: 40 },
      { name: 'AirPods Pro', description: 'Wireless earbuds with active noise cancellation', price: 249, brand: 'Apple', stock: 50 },
      { name: 'iPad Air', description: 'Versatile tablet for work and play', price: 599, brand: 'Apple', stock: 35 },
      { name: 'Samsung 55" 4K TV', description: 'Crystal clear 4K television', price: 799, brand: 'Samsung', stock: 10 },
      { name: 'Nintendo Switch OLED', description: 'Handheld gaming console', price: 349, brand: 'Nintendo', stock: 45 },
      { name: 'GoPro HERO11', description: 'Action camera for adventure', price: 499, brand: 'GoPro', stock: 28 },
    ];

    // Clothing products
    const clothingProducts = [
      { name: 'Nike Air Max 270', description: 'Comfortable running shoes', price: 150, brand: 'Nike', stock: 60 },
      { name: 'Levi\'s 501 Jeans', description: 'Classic straight fit jeans', price: 89, brand: 'Levi\'s', stock: 75 },
      { name: 'Adidas Ultraboost', description: 'High-performance running shoes', price: 180, brand: 'Adidas', stock: 55 },
      { name: 'H&M Cotton T-Shirt', description: 'Basic cotton t-shirt', price: 12, brand: 'H&M', stock: 100 },
      { name: 'Zara Wool Coat', description: 'Elegant winter coat', price: 199, brand: 'Zara', stock: 25 },
      { name: 'Uniqlo Down Jacket', description: 'Lightweight down jacket', price: 129, brand: 'Uniqlo', stock: 40 },
      { name: 'Puma Tracksuit', description: 'Comfortable tracksuit set', price: 89, brand: 'Puma', stock: 50 },
      { name: 'Gucci Leather Bag', description: 'Luxury leather handbag', price: 1299, brand: 'Gucci', stock: 8 },
      { name: 'Supreme Box Logo Hoodie', description: 'Iconic streetwear hoodie', price: 299, brand: 'Supreme', stock: 15 },
      { name: 'Calvin Klein Underwear Set', description: 'Cotton underwear set', price: 45, brand: 'Calvin Klein', stock: 80 },
    ];

    // Home & Kitchen products
    const homeKitchenProducts = [
      { name: 'KitchenAid Stand Mixer', description: 'Professional stand mixer', price: 379, brand: 'KitchenAid', stock: 12 },
      { name: 'Instant Pot Duo', description: 'Multi-cooker pressure cooker', price: 89, brand: 'Instant Pot', stock: 30 },
      { name: 'Dyson V15 Vacuum', description: 'Cordless vacuum cleaner', price: 699, brand: 'Dyson', stock: 18 },
      { name: 'Ninja Blender', description: 'High-speed blender', price: 99, brand: 'Ninja', stock: 25 },
      { name: 'Cuisinart Coffee Maker', description: 'Programmable coffee maker', price: 79, brand: 'Cuisinart', stock: 35 },
      { name: 'Le Creuset Dutch Oven', description: 'Cast iron Dutch oven', price: 329, brand: 'Le Creuset', stock: 20 },
      { name: 'Breville Toaster', description: '4-slice toaster', price: 149, brand: 'Breville', stock: 28 },
      { name: 'Philips Air Fryer', description: 'Healthy air fryer', price: 199, brand: 'Philips', stock: 22 },
      { name: 'OXO Good Grips Tools Set', description: 'Kitchen utensils set', price: 49, brand: 'OXO', stock: 45 },
      { name: 'Vitamix Blender', description: 'Professional blender', price: 649, brand: 'Vitamix', stock: 10 },
    ];

    // Books products
    const booksProducts = [
      { name: 'The Great Gatsby', description: 'Classic American novel', price: 12, brand: 'Penguin Classics', stock: 50 },
      { name: 'To Kill a Mockingbird', description: 'Pulitzer Prize winning novel', price: 14, brand: 'HarperCollins', stock: 45 },
      { name: '1984', description: 'Dystopian novel by George Orwell', price: 13, brand: 'Penguin Books', stock: 40 },
      { name: 'Pride and Prejudice', description: 'Jane Austen classic', price: 11, brand: 'Oxford University Press', stock: 55 },
      { name: 'The Catcher in the Rye', description: 'Coming-of-age novel', price: 10, brand: 'Little, Brown and Company', stock: 35 },
      { name: 'Harry Potter and the Sorcerer\'s Stone', description: 'Fantasy adventure novel', price: 15, brand: 'Scholastic', stock: 60 },
      { name: 'The Lord of the Rings', description: 'Epic fantasy trilogy', price: 25, brand: 'Houghton Mifflin', stock: 30 },
      { name: 'Dune', description: 'Science fiction masterpiece', price: 18, brand: 'Ace Books', stock: 25 },
      { name: 'The Alchemist', description: 'Philosophical novel', price: 16, brand: 'HarperOne', stock: 40 },
      { name: 'Sapiens: A Brief History of Humankind', description: 'Non-fiction bestseller', price: 22, brand: 'Harper', stock: 35 },
    ];

    // Sports & Outdoors products
    const sportsProducts = [
      { name: 'Peloton Bike', description: 'Indoor cycling bike', price: 2495, brand: 'Peloton', stock: 5 },
      { name: 'Nike Yoga Mat', description: 'Non-slip yoga mat', price: 39, brand: 'Nike', stock: 70 },
      { name: 'Wilson Tennis Racket', description: 'Professional tennis racket', price: 199, brand: 'Wilson', stock: 25 },
      { name: 'Patagonia Hiking Backpack', description: 'Durable hiking backpack', price: 149, brand: 'Patagonia', stock: 30 },
      { name: 'Under Armour Running Shoes', description: 'Lightweight running shoes', price: 129, brand: 'Under Armour', stock: 40 },
      { name: 'REI Camping Tent', description: '4-person camping tent', price: 299, brand: 'REI', stock: 15 },
      { name: 'Garmin Forerunner 245', description: 'GPS running watch', price: 349, brand: 'Garmin', stock: 20 },
      { name: 'Titleist Golf Balls', description: 'Premium golf balls', price: 49, brand: 'Titleist', stock: 100 },
      { name: 'Yeti Cooler', description: 'Insulated cooler', price: 299, brand: 'Yeti', stock: 18 },
      { name: 'Manduka Yoga Block Set', description: 'Yoga accessories', price: 29, brand: 'Manduka', stock: 50 },
    ];

    // Beauty & Personal Care products
    const beautyProducts = [
      { name: 'The Ordinary Hyaluronic Acid', description: 'Hydrating serum', price: 7, brand: 'The Ordinary', stock: 80 },
      { name: 'Dyson Airwrap', description: 'Multi-styling tool', price: 599, brand: 'Dyson', stock: 12 },
      { name: 'Fenty Beauty Pro Filt\'r Soft Matte', description: 'Longwear foundation', price: 35, brand: 'Fenty Beauty', stock: 45 },
      { name: 'CeraVe Moisturizing Cream', description: 'Daily facial moisturizer', price: 16, brand: 'CeraVe', stock: 60 },
      { name: 'Anastasia Beverly Hills Brow Wiz', description: 'Brow pencil', price: 23, brand: 'Anastasia Beverly Hills', stock: 55 },
      { name: 'Oribe Shampoo', description: 'Luxury hair shampoo', price: 68, brand: 'Oribe', stock: 25 },
      { name: 'Drunk Elephant C-Firma Day Serum', description: 'Vitamin C serum', price: 78, brand: 'Drunk Elephant', stock: 30 },
      { name: 'Glossier Lip Gloss', description: 'Sheer lip gloss', price: 16, brand: 'Glossier', stock: 70 },
      { name: 'La Mer Crème de la Mer', description: 'Luxury face cream', price: 190, brand: 'La Mer', stock: 15 },
      { name: 'Bioderma Micellar Water', description: 'Gentle cleanser', price: 14, brand: 'Bioderma', stock: 65 },
    ];

    // Toys & Games products
    const toysProducts = [
      { name: 'LEGO Creator 3-in-1', description: 'Building set for kids', price: 99, brand: 'LEGO', stock: 40 },
      { name: 'Nintendo Switch Lite', description: 'Handheld gaming console', price: 199, brand: 'Nintendo', stock: 35 },
      { name: 'Barbie Dreamhouse', description: 'Doll house playset', price: 299, brand: 'Barbie', stock: 20 },
      { name: 'Hot Wheels Track Builder', description: 'Toy car racing set', price: 49, brand: 'Hot Wheels', stock: 60 },
      { name: 'Catan Board Game', description: 'Strategy board game', price: 59, brand: 'Catan', stock: 45 },
      { name: 'Fisher-Price Rock-a-Stack', description: 'Baby stacking toy', price: 12, brand: 'Fisher-Price', stock: 75 },
      { name: 'Play-Doh Modeling Compound', description: 'Creative play dough', price: 8, brand: 'Play-Doh', stock: 90 },
      { name: 'Nerf N-Strike Elite', description: 'Toy blaster gun', price: 29, brand: 'Nerf', stock: 55 },
      { name: 'Melissa & Doug Puzzle', description: 'Wooden puzzle set', price: 19, brand: 'Melissa & Doug', stock: 50 },
      { name: 'Starry Night Projector', description: 'Night light projector', price: 39, brand: 'Starry Night', stock: 40 },
    ];

    // Automotive products
    const automotiveProducts = [
      { name: 'Michelin Pilot Sport 4S', description: 'High-performance tires', price: 199, brand: 'Michelin', stock: 20 },
      { name: 'Mobil 1 Synthetic Oil', description: 'Engine oil 5-quart', price: 39, brand: 'Mobil', stock: 50 },
      { name: 'Bosch Spark Plugs', description: 'Set of 4 spark plugs', price: 29, brand: 'Bosch', stock: 60 },
      { name: 'Armor All Car Wax', description: 'Car wax and sealant', price: 12, brand: 'Armor All', stock: 80 },
      { name: 'Rain-X Windshield Wipers', description: 'Windshield wiper blades', price: 24, brand: 'Rain-X', stock: 70 },
      { name: 'Meguiar\'s Car Wash Soap', description: 'Car wash concentrate', price: 16, brand: 'Meguiar\'s', stock: 65 },
      { name: 'K&N Air Filter', description: 'High-flow air filter', price: 59, brand: 'K&N', stock: 35 },
      { name: 'BlueDriver Bluetooth Scanner', description: 'OBD2 car diagnostic tool', price: 99, brand: 'BlueDriver', stock: 25 },
      { name: 'Chemical Guys Leather Cleaner', description: 'Leather interior cleaner', price: 19, brand: 'Chemical Guys', stock: 45 },
      { name: 'Lucas Oil Stabilizer', description: 'Engine oil treatment', price: 14, brand: 'Lucas Oil', stock: 55 },
    ];

    // Health & Household products
    const healthProducts = [
      { name: 'Theragun Mini', description: 'Portable massage gun', price: 199, brand: 'Theragun', stock: 15 },
      { name: 'Oura Ring', description: 'Smart ring for health tracking', price: 299, brand: 'Oura', stock: 10 },
      { name: 'Philips Sonicare Toothbrush', description: 'Electric toothbrush', price: 89, brand: 'Philips', stock: 40 },
      { name: 'Tylenol Extra Strength', description: 'Pain reliever tablets', price: 8, brand: 'Tylenol', stock: 100 },
      { name: 'Advil Ibuprofen', description: 'Anti-inflammatory pain reliever', price: 12, brand: 'Advil', stock: 85 },
      { name: 'Band-Aid Adhesive Bandages', description: 'Assorted bandages', price: 5, brand: 'Band-Aid', stock: 120 },
      { name: 'Lysol Disinfectant Spray', description: 'Multi-surface disinfectant', price: 6, brand: 'Lysol', stock: 90 },
      { name: 'Clorox Bleach', description: 'Household bleach', price: 4, brand: 'Clorox', stock: 110 },
      { name: 'Bounty Paper Towels', description: 'Paper towel rolls', price: 15, brand: 'Bounty', stock: 75 },
      { name: 'Charmin Toilet Paper', description: 'Ultra soft toilet paper', price: 18, brand: 'Charmin', stock: 80 },
    ];

    // Grocery products
    const groceryProducts = [
      { name: 'Kirkland Signature Coffee', description: 'Ground coffee beans', price: 12, brand: 'Kirkland', stock: 60 },
      { name: 'Quaker Oats', description: 'Old fashioned oats', price: 4, brand: 'Quaker', stock: 80 },
      { name: 'Nutella Hazelnut Spread', description: 'Chocolate hazelnut spread', price: 5, brand: 'Nutella', stock: 70 },
      { name: 'Lays Potato Chips', description: 'Classic potato chips', price: 3, brand: 'Lays', stock: 100 },
      { name: 'Coca-Cola Classic', description: '12-pack soda cans', price: 6, brand: 'Coca-Cola', stock: 50 },
      { name: 'Kellogg\'s Corn Flakes', description: 'Breakfast cereal', price: 4, brand: 'Kellogg\'s', stock: 65 },
      { name: 'Ben & Jerry\'s Ice Cream', description: 'Pint of ice cream', price: 6, brand: 'Ben & Jerry\'s', stock: 40 },
      { name: 'Heinz Ketchup', description: 'Tomato ketchup', price: 3, brand: 'Heinz', stock: 85 },
      { name: 'Campbell\'s Soup', description: 'Chicken noodle soup', price: 2, brand: 'Campbell\'s', stock: 90 },
      { name: 'Oreo Cookies', description: 'Chocolate sandwich cookies', price: 4, brand: 'Oreo', stock: 75 },
    ];

    const allProducts = [
      ...electronicsProducts.map(p => ({ ...p, category: categoryMap['Electronics'] })),
      ...clothingProducts.map(p => ({ ...p, category: categoryMap['Clothing'] })),
      ...homeKitchenProducts.map(p => ({ ...p, category: categoryMap['Home & Kitchen'] })),
      ...booksProducts.map(p => ({ ...p, category: categoryMap['Books'] })),
      ...sportsProducts.map(p => ({ ...p, category: categoryMap['Sports & Outdoors'] })),
      ...beautyProducts.map(p => ({ ...p, category: categoryMap['Beauty & Personal Care'] })),
      ...toysProducts.map(p => ({ ...p, category: categoryMap['Toys & Games'] })),
      ...automotiveProducts.map(p => ({ ...p, category: categoryMap['Automotive'] })),
      ...healthProducts.map(p => ({ ...p, category: categoryMap['Health & Household'] })),
      ...groceryProducts.map(p => ({ ...p, category: categoryMap['Grocery'] })),
    ];

    // Add images and other fields with real product images
    allProducts.forEach((product, index) => {
      // Real product images from the internet for each category
      const categoryImages = {
        'Electronics': [
          'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500&h=500&fit=crop', // iPhone
          'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=500&h=500&fit=crop', // Samsung
          'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=500&h=500&fit=crop', // MacBook
          'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&h=500&fit=crop', // Dell Laptop
          'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500&h=500&fit=crop', // Sony Headphones
          'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500&h=500&fit=crop', // AirPods
          'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&h=500&fit=crop', // iPad
          'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=500&h=500&fit=crop', // Samsung TV
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop', // Nintendo Switch
          'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&h=500&fit=crop', // GoPro
        ],
        'Clothing': [
          'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500&h=500&fit=crop', // Nike Shoes
          'https://images.unsplash.com/photo-1542272604-787c3835535d?w=500&h=500&fit=crop', // Levi's Jeans
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop', // Adidas Shoes
          'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop', // T-Shirt
          'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=500&h=500&fit=crop', // Wool Coat
          'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop', // Down Jacket
          'https://images.unsplash.com/photo-1506629905607-0b5ab9a9e21a?w=500&h=500&fit=crop', // Tracksuit
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', // Leather Bag
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop', // Hoodie
          'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?w=500&h=500&fit=crop', // Underwear
        ],
        'Home & Kitchen': [
          'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop', // KitchenAid Mixer
          'https://images.unsplash.com/photo-1556909114-4c36e03f4b3f?w=500&h=500&fit=crop', // Instant Pot
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Dyson Vacuum
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop', // Blender
          'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop', // Coffee Maker
          'https://images.unsplash.com/photo-1556909114-4c36e03f4b3f?w=500&h=500&fit=crop', // Dutch Oven
          'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=500&fit=crop', // Toaster
          'https://images.unsplash.com/photo-1556909114-4c36e03f4b3f?w=500&h=500&fit=crop', // Air Fryer
          'https://images.unsplash.com/photo-1556909114-4c36e03f4b3f?w=500&h=500&fit=crop', // Kitchen Tools
          'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&h=500&fit=crop', // Vitamix Blender
        ],
        'Books': [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', // The Great Gatsby
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', // To Kill a Mockingbird
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', // 1984
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', // Pride and Prejudice
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', // The Catcher in the Rye
          'https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=500&h=500&fit=crop', // Harry Potter
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', // Lord of the Rings
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', // Dune
          'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&h=500&fit=crop', // The Alchemist
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&h=500&fit=crop', // Sapiens
        ],
        'Sports & Outdoors': [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', // Peloton Bike
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop', // Yoga Mat
          'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500&h=500&fit=crop', // Tennis Racket
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop', // Hiking Backpack
          'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&h=500&fit=crop', // Running Shoes
          'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=500&h=500&fit=crop', // Camping Tent
          'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop', // Garmin Watch
          'https://images.unsplash.com/photo-1587174486073-ae3f3bf06565?w=500&h=500&fit=crop', // Golf Balls
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Yeti Cooler
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop', // Yoga Block
        ],
        'Beauty & Personal Care': [
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', // Hyaluronic Acid
          'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=500&fit=crop', // Dyson Airwrap
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop', // Foundation
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', // Moisturizing Cream
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop', // Brow Pencil
          'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?w=500&h=500&fit=crop', // Shampoo
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', // Vitamin C Serum
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=500&h=500&fit=crop', // Lip Gloss
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', // Face Cream
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&h=500&fit=crop', // Micellar Water
        ],
        'Toys & Games': [
          'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=500&h=500&fit=crop', // LEGO
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=500&fit=crop', // Nintendo Switch
          'https://images.unsplash.com/photo-1545558014-8692077e5b5c?w=500&h=500&fit=crop', // Barbie Dollhouse
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop', // Hot Wheels
          'https://images.unsplash.com/photo-1610890716171-6b85b4e4b599?w=500&h=500&fit=crop', // Board Game
          'https://images.unsplash.com/photo-1558877385-1199c1af4e2f?w=500&h=500&fit=crop', // Baby Toy
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop', // Play-Doh
          'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=500&h=500&fit=crop', // Nerf Gun
          'https://images.unsplash.com/photo-1558877385-1199c1af4e2f?w=500&h=500&fit=crop', // Puzzle
          'https://images.unsplash.com/photo-1545558014-8692077e5b5c?w=500&h=500&fit=crop', // Night Light
        ],
        'Automotive': [
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Car Tires
          'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&h=500&fit=crop', // Engine Oil
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Spark Plugs
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Car Wax
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Windshield Wipers
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Car Wash Soap
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Air Filter
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Diagnostic Tool
          'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop', // Leather Cleaner
          'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&h=500&fit=crop', // Oil Treatment
        ],
        'Health & Household': [
          'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500&h=500&fit=crop', // Massage Gun
          'https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=500&fit=crop', // Smart Ring
          'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=500&h=500&fit=crop', // Electric Toothbrush
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', // Pain Reliever
          'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&h=500&fit=crop', // Ibuprofen
          'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=500&h=500&fit=crop', // Bandages
          'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=500&fit=crop', // Disinfectant
          'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=500&fit=crop', // Bleach
          'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=500&fit=crop', // Paper Towels
          'https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=500&h=500&fit=crop', // Toilet Paper
        ],
        'Grocery': [
          'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&h=500&fit=crop', // Coffee
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', // Oats
          'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=500&h=500&fit=crop', // Nutella
          'https://images.unsplash.com/photo-1566479179818-1e9d9d0e8b8b?w=500&h=500&fit=crop', // Potato Chips
          'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=500&h=500&fit=crop', // Soda
          'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&h=500&fit=crop', // Cereal
          'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=500&h=500&fit=crop', // Ice Cream
          'https://images.unsplash.com/photo-1471691118455-ae0ce1e487e5?w=500&h=500&fit=crop', // Ketchup
          'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=500&h=500&fit=crop', // Soup
          'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&h=500&fit=crop', // Cookies
        ],
      };

      // Get the category name from the product's category ObjectId
      const categoryName = savedCategories.find(cat => cat._id.equals(product.category))?.name;
      const categoryImageList = categoryImages[categoryName] || [];

      // Assign appropriate image based on product index within category
      const categoryIndex = allProducts.filter(p => p.category.equals(product.category)).indexOf(product);
      product.images = [categoryImageList[categoryIndex % categoryImageList.length] || `https://picsum.photos/seed/product${index + 1}/500/500`];

      product.ratings = Math.floor(Math.random() * 5) + 1;
      product.numReviews = Math.floor(Math.random() * 100) + 1;
      product.originalPrice = product.price * (1 + Math.random() * 0.5); // Random original price
      product.features = ['High quality', 'Durable', 'Reliable'];
    });

    await Product.insertMany(allProducts);

    console.log('Data seeded successfully with 100 products');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();