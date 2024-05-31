const OrderService = require('../services/orderService')

module.exports.CreateOrderController = async (req, res) => {
    try {
        const { username, orderData, orderTypeData } = req.body;
        await OrderService.CreateOrderService(username, orderData, orderTypeData)
        res.status(200).json({ message: 'Order created successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create order', error: error.toString() });
    }
}