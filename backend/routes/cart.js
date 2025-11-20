const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

router.get('/', auth, cartController.getCart);
router.post('/add', auth, cartController.addToCart);
router.put('/item/:itemId', auth, cartController.updateCartItem);
router.delete('/item/:itemId', auth, cartController.removeFromCart);

module.exports = router;