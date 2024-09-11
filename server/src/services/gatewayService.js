/*
    dependencies
*/
    const User = require('./userService')
    const Order = require('./orderService')
    // const Payment = require('../models/paymentModel')
    const axios = require('axios')
/*
    ================================================================= // SERVICES
*/
    // -------------------------------------------------------------- PAYMENT
    module.exports.CreateGatewayService = async (orderId) => {
        try {
            const order = await Order.FindOrderByIdService(orderId)
            if (!order) { throw new Error('Order not found') }
            
            const user = await User.FindUserByIdService(order.user)
            if (!user) { throw new Error('User not found') }

            // Payment gateway code
            const response = await axios.post('https://payments.yoco.com/api/checkouts', {
                amount: order.totalAmount * 100,
                currency: 'ZAR',
                successUrl: 'http://localhost:9000/payment-success',
                cancelUrl: 'http://localhost:9000/payment-cancel',
                failureUrl: 'http://localhost:9000/payment-failure'
            }, {
                headers: {
                    'Authorization': `Bearer sk_test_e02fb7dfbBDAnPW2601448c89fc4`
                }
            })
            const checkout = response.data;
            return { checkout, order }

        } catch (error) {
            throw error;
        }
    }
    // module.exports.CreateGatewayService = async (orderId) => {
    //     try {
    //         const order = await Order.FindOrderByIdService(orderId)
    //         if (!order) { throw new Error('Order not found') }
            
    //         const user = await User.FindUserByIdService(order.user)
    //         if (!user) { throw new Error('User not found') }

    //         const payment = new Payment({
    //             paymentAmount: order.totalAmount,
    //             currency: 'ZAR',
    //             paymentDate: Date.now(),
    //             status: 'paid',
    //             description: 'this item has been paid for',
    //             order: order._id
    //         });

    //         // update payment details
    //         await payment.save();

    //         // update order details
    //         order.payment = payment._id
    //         order.status = 'paid';
    //         await order.save();

    //         return { payment, order };

    //     } catch (error) {
    //         throw error;
    //     }
    // }