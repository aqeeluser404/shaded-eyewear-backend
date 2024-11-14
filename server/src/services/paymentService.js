const Payment = require('../models/paymentModel')

module.exports.CreatePaymentService = async (order) => {
    try {
        const payment = new Payment({
            paymentAmount: order.totalAmount,
            currency: 'ZAR',
            paymentDate: Date.now(),
            status: 'paid',
            description: `Ordered on the ${order.orderDate}`,   // Using checkout.id as reference
            order: order._id
        })
        await payment.save()
        console.log('Payment saved:', payment) // Log payment saving

        // update to paid
        order.status = 'paid'
        order.payment = payment._id
        await order.save()
        console.log('Order updated to paid:', order) // Log order update

        return payment
    } catch (error) {
        console.error('Error in CreatePaymentService:', error) // Log errors
        throw(error)
    }
}
