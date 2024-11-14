const express = require('express')
const router = express.Router();
const GatewayController = require('../src/controllers/gatewayController')
const { verifyToken } = require('../middleware/authentication')

router.post('/gateway/pay', verifyToken, GatewayController.CreateGatewayController)
router.post('/payment-success', GatewayController.PaymentSuccessController)

module.exports = router;