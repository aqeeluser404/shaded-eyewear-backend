const OrderService = require('../src/services/orderService')

module.exports.CreateOrderController = async (req, res) => {
    try {
        const { id } = req.params
        const { orderData, orderTypeData } = req.body
        const order = await OrderService.CreateOrderService(id, orderData, orderTypeData)
        res.status(201).json({ message: 'Order created successfully', order })
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.toString() })
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
        const { orderData, orderTypeData } = req.body;
        const { id } = req.params

        const updatedOrder = await OrderService.UpdateOrdersService(id, orderData, orderTypeData)
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