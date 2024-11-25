const express = require('express')
const router = express.Router();
const OrderController = require('../src/controllers/orderController')
const { verifyToken, requireAdmin } = require('../middleware/authentication')

router.post('/order/create/:id', verifyToken, OrderController.CreateOrderController)
router.post('/order/create-pickup/:id', verifyToken, OrderController.OrderPickupController)

router.put('/order/cancel-order/:id', OrderController.CancelOrderController)
router.get('/order/my-orders/:id', verifyToken, OrderController.FindAllMyOrdersController)
router.get('/order/view/:id', verifyToken, OrderController.FindOrderByIdController)
router.put('/order/update/:id', verifyToken, OrderController.UpdateOrdersController)
router.put('/order/update/status/:id', verifyToken, requireAdmin, OrderController.UpdatePickupOrdersController)

// admin routes
router.get('/admin/order/all', verifyToken, requireAdmin, OrderController.FindAllOrdersController)
router.delete('/order/delete/:id', OrderController.DeleteOrderController)

// refund
router.post('/order/refund', verifyToken, OrderController.RefundOrderController)

module.exports = router;
