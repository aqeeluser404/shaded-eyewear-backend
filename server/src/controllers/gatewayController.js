const GatewayService = require('../services/gatewayService')
const PaymentService = require('../services/paymentService')


module.exports.CreateGatewayController = async (req, res) => {
    try {
        const { orderId } = req.body
        const { checkout, order } = await GatewayService.CreateGatewayService(orderId)
        const payment = await PaymentService.CreatePaymentService(checkout, order)

        console.log('Payment created:', payment)  // Log payment creation

        res.status(200).json({ checkout, order, payment })
    } catch (error) {
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
