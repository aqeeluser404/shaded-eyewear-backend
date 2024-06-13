const GatewayService = require('../services/gatewayService')
const PaymentService = require('../services/paymentService')

module.exports.CreateGatewayController = async (req, res) => {
    try {
        const { orderId, source } = req.body;
        const { charge, order } = await GatewayService.CreateGatewayService(orderId, source);
        
        const payment = await PaymentService.CreatePaymentService(charge, order);

        res.status(200).json({ charge, order, payment });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
}