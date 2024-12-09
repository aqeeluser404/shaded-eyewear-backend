const OrderService = require('../services/orderService')

module.exports.CreateOrderController = async (req, res) => {
    try {
        const { id } = req.params
        const { orderData } = req.body
        const order = await OrderService.CreateOrderService(id, orderData)
        res.status(201).json({ message: 'Order created successfully', order })
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.toString() })
    }
}
module.exports.OrderPickupController = async (req, res) => {
    try {
        const { id } = req.params
        const orderPickup = await OrderService.OrderPickupService(id)
        res.status(201).json({ message: 'Order Pickup created successfully', orderPickup })
    } catch (error) {
        res.status(500).json({ message: 'Failed to create Order Pickup', error: error.toString() })
    }
}
module.exports.CancelOrderController = async (req, res) => {
    try {
        const { id } = req.params
        await OrderService.CancelOrderService(id)
        res.status(200).json({ message: 'Order cancelled successfully' })
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to cancel order', error: error.toString() })
    }
}
module.exports.FindOrderByIdController = async (req, res) => {
    try {
        const { id } = req.params
        const order = await OrderService.FindOrderByIdService(id);
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: 'Failed to find order', error: error.toString() })
    }
}
module.exports.FindAllMyReturnsController = async (req, res) => {
    try {
        const { id } = req.params
        const returns = await OrderService.FindAllMyReturnsService(id);
        res.status(200).json(returns)
    } catch (error) {
        res.status(500).json({ message: 'Failed to find return', error: error.toString() })
    }
}
module.exports.FindAllOrdersController = async (req, res) => {
    try {
        const orders = await OrderService.FindAllOrdersServices()
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Failed to find orders', error: error.toString() })
    }
}
module.exports.FindAllMyOrdersController = async (req, res) => {
    try {
        const { id } = req.params
        const orders = await OrderService.FindAllMyOrdersService(id)
        res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ message: 'Failed to find orders', error: error.toString() })
    }
}
module.exports.UpdateOrdersController = async (req, res) => {
    try {
        const { orderData } = req.body;
        const { id } = req.params

        const updatedOrder = await OrderService.UpdateOrdersService(id, orderData)
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order', error: error.toString() })
    }
}
module.exports.UpdatePickupOrdersController = async (req, res) => {
    try {
        const { id } = req.params
        const updatedOrder = await OrderService.UpdatePickupOrdersService(id)
        res.status(200).json(updatedOrder)
    } catch (error) {
        res.status(500).json({ message: 'Failed to update order', error: error.toString() })
    }
}
module.exports.DeleteOrderController = async (req, res) => {
    try {
        const { id } = req.params
        const deletedOrder = await OrderService.DeleteOrderService(id);
        res.status(200).json(deletedOrder)
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete order', error: error.toString() })
    }
}
module.exports.RefundOrderController = async (req, res) => {
    try {
        const { orderId, sunglassesToRefund } = req.body
        const refundedOrder = await OrderService.RefundOrderService(orderId, sunglassesToRefund)
        res.status(200).json(refundedOrder)
    } catch (error) {
        res.status(500).json({ message: 'Failed to refund order', error: error.toString() })
    }
}