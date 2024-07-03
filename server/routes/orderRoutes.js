/*
    dependencies
*/
    const express = require('express')
    const router = express.Router();
    const OrderController = require('../src/controllers/orderController')
    const { verifyToken, requireAdmin } = require('../middleware/authentication')
/*
    ================================================================= admin routes
*/
    router.get('/admin/order/all', verifyToken, requireAdmin, OrderController.FindAllOrdersController)
    router.delete('/admin/order/delete/:id', verifyToken, requireAdmin, OrderController.DeleteOrderController)
/*
    ================================================================= admin & user routes
*/
    router.post('/order/create/:id', verifyToken, OrderController.CreateOrderController)
    router.put('/order/cancel-order/:id', verifyToken, OrderController.CancelOrderController)
    router.get('/order/my-orders/:id', verifyToken, OrderController.FindAllMyOrdersController)
    router.get('/order/view/:id', verifyToken, OrderController.FindOrderByIdController)
    router.put('/order/update/:id', verifyToken, OrderController.UpdateOrdersController)

    module.exports = router;