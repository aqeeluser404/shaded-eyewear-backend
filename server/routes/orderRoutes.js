const express = require('express')
const router = express.Router();
const OrderController = require('../src/controllers/orderController')
const { verifyToken, requireAdmin, requireUser } = require('../middleware/authentication');

router.post('/user/order', verifyToken, requireUser, OrderController.CreateOrderController)

module.exports = router;
