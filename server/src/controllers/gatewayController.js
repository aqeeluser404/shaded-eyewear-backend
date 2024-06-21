/*
    dependencies
*/
    const GatewayService = require('../services/gatewayService')
    const PaymentService = require('../services/paymentService')
/*
    ================================================================= // CONTROLLERS
*/
    module.exports.CreateGatewayController = async (req, res) => {
        try {
            const { orderId } = req.body;
            
            const { payment } = await GatewayService.CreateGatewayService(orderId);
            res.status(200).json(payment)

            // const { charge, order } = await GatewayService.CreateGatewayService(orderId);
            // const payment = await PaymentService.CreatePaymentService(charge, order);
            // res.status(200).json({ charge, order, payment });

        } catch (error) {
            res.status(500).json({ error: error.toString() });
        }
    }