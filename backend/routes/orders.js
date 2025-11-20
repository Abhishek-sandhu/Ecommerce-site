const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, orderController.createOrder);
router.get('/myorders', auth, orderController.getMyOrders);
router.get('/:id', auth, orderController.getOrderById);
router.post('/payment/create', auth, orderController.createPaymentOrder);
router.post('/payment/verify', auth, orderController.verifyPayment);

// Admin routes
router.get('/', auth, admin, orderController.getAllOrders);
router.put('/:id/status', auth, admin, orderController.updateOrderStatus);

module.exports = router;