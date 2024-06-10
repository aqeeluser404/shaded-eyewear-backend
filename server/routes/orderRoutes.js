const express = require('express')
const router = express.Router();
const OrderController = require('../src/controllers/orderController')
const { verifyToken, requireAdmin } = require('../middleware/authentication');

// admin routes
// router.get('/admin/order/all', verifyToken, requireAdmin, OrderController.FindAllOrdersController)
// router.delete('admin/order/delete/:id', verifyToken, requireAdmin, OrderController.DeleteOrderController)

// user & admin routes
router.post('/order/create', verifyToken, OrderController.CreateOrderController)
// router.get('/order/my-orders', verifyToken, OrderController.FindMyOrdersController)
// router.get('/order/view/:id', verifyToken, OrderController.FindOrderByIdController)
// router.put('/order/update/:id', verifyToken, OrderController.UpdateOrderController)

module.exports = router;
