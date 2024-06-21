/*
    dependencies
*/
    const Payment = require('../models/paymentModel')
/*
    ================================================================= // SERVICES
*/
    // -------------------------------------------------------------- CREATE PAYMENT
    module.exports.CreatePaymentService = async (charge, order) => {
        try {
            const payment = new Payment({
                paymentAmount: charge.amount,
                currency: charge.currency,
                paymentDate: Date.now(),
                status: charge.status,
                description: charge.reference,
                order: order._id
            });
            await payment.save()
            return payment
        } catch (error) {
            throw(error)
        }
    }