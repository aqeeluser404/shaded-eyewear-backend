/*
    dependencies
*/
    const Payment = require('../models/paymentModel')
/*
    ================================================================= // SERVICES
*/
    // -------------------------------------------------------------- CREATE PAYMENT
    module.exports.CreatePaymentService = async (checkout, order) => {
        try {
            const payment = new Payment({
                paymentAmount: checkout.amount,
                currency: checkout.currency,
                paymentDate: Date.now(),
                status: checkout.status,
                description: checkout.id,   // Using checkout.id as reference
                order: order._id
            })
            await payment.save()

            // update to paid
            order.status = 'paid';
            order.payment = payment._id;
            await order.save();

            return payment
        } catch (error) {
            throw(error)
        }
    }