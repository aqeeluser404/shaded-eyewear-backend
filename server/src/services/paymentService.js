const Payment = require('../models/paymentModel')

module.exports.CreatePaymentService = async (charge, order) => {
    return new Promise(async (resolve, reject) => {
        try {
            const payment = new Payment({
                paymentAmount: charge.amount,
                currency: charge.currency,
                paymentDate: Date.now(),
                status: charge.status,
                description: charge.reference,
                order: order._id
            });
            await payment.save();
            resolve(payment);
        } catch (error) {
            reject(error);
        }
    });
}
