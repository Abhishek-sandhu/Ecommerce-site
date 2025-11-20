const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/dashboard', auth, admin, adminController.getDashboardStats);
router.get('/users', auth, admin, adminController.getAllUsers);
router.get('/products', auth, admin, adminController.getAllProducts);
router.post('/products', auth, admin, adminController.createProduct);
router.put('/products/:id', auth, admin, adminController.updateProduct);
router.delete('/products/:id', auth, admin, adminController.deleteProduct);
router.get('/categories', auth, admin, adminController.getAllCategories);
router.post('/categories', auth, admin, adminController.createCategory);
router.get('/coupons', auth, admin, adminController.manageCoupons);
router.post('/coupons', auth, admin, adminController.createCoupon);
router.put('/coupons/:id', auth, admin, adminController.updateCoupon);
router.delete('/coupons/:id', auth, admin, adminController.deleteCoupon);

module.exports = router;