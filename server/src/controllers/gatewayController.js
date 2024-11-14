const GatewayService = require('../services/gatewayService')
const OrderService = require('../services/orderService')
const PaymentService = require('../services/paymentService')
const { pickupNotification } = require('../utils/sendEmail')
const User = require('../models/userModel')

module.exports.CreateGatewayController = async (req, res) => {
    try {
        const { orderId } = req.body
        const { checkout, order } = await GatewayService.CreateGatewayService(orderId)

        if (!checkout || !order) {
            throw new Error('Gateway service failed')
        }
        // const payment = await PaymentService.CreatePaymentService(checkout, order)

        // console.log('Payment created:', payment)  // Log payment creation

        res.status(200).json({ checkout, order })
    } catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}
// module.exports.GetCheckoutDetailsController = async (req, res) => {
//     try {
//         const { orderId } = req.query;
//         const checkout = await GatewayService.GetCheckoutDetailsService(orderId);
//         res.status(200).json({ checkout });
//     } catch (error) {
//         res.status(500).json({ error: error.toString() });
//     }
// };
module.exports.PaymentSuccessController = async (req, res) => {
    try {
        const { orderId } = req.query

        const order = await OrderService.FindOrderByIdService(orderId)
        if (!order) { 
            throw new Error('Order not found')
        }
        const user = await User.findOne({ _id: order.user })
        if (!user) {
            return res.status(404).send('User not found.')
        }

        pickupNotification(user, order)

        const payment = await PaymentService.CreatePaymentService(order)
        res.status(200).json({ message: 'Payment successful', payment })
    } catch (error) {
        console.error('Error in PaymentSuccessController:', error)
        res.status(500).json({ error: error.toString() })
    }
}

// module.exports.CreateGatewayController = async (req, res) => {
//     try {
//         const { orderId } = req.body;
        
//         const { payment } = await GatewayService.CreateGatewayService(orderId);
//         res.status(200).json(payment)

//     } catch (error) {
//         res.status(500).json({ error: error.toString() });
//     }
// }
