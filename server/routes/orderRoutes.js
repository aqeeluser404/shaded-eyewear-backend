const express = require('express')
const router = express.Router();
const OrderController = require('../src/controllers/orderController')
const { verifyToken, requireAdmin } = require('../middleware/authentication')

router.post('/order/create/:id', verifyToken, OrderController.CreateOrderController)
router.put('/order/cancel-order/:id', verifyToken, OrderController.CancelOrderController)
router.get('/order/my-orders/:id', verifyToken, OrderController.FindAllMyOrdersController)
router.get('/order/view/:id', verifyToken, OrderController.FindOrderByIdController)
router.put('/order/update/:id', verifyToken, OrderController.UpdateOrdersController)

// admin routes
router.get('/admin/order/all', verifyToken, requireAdmin, OrderController.FindAllOrdersController)
router.delete('/order/delete/:id', verifyToken, requireAdmin, OrderController.DeleteOrderController)

module.exports = router;
