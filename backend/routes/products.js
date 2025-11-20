const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.post('/:id/reviews', auth, productController.addReview);

router.get('/categories', productController.getCategories);

// Admin routes
router.post('/', auth, admin, productController.createProduct);
router.put('/:id', auth, admin, productController.updateProduct);
router.delete('/:id', auth, admin, productController.deleteProduct);
router.post('/categories', auth, admin, productController.createCategory);

module.exports = router;