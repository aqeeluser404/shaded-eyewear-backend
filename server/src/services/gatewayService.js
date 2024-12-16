const User = require('./userService')
const Order = require('./orderService')
const axios = require('axios')

module.exports.CreateGatewayService = async (orderId) => {
    try {
        const order = await Order.FindOrderByIdService(orderId);
        if (!order) { throw new Error('Order not found'); }
        
        const user = await User.FindUserByIdService(order.user);
        if (!user) { throw new Error('User not found'); }

        // Payment gateway code
        const response = await axios.post('https://payments.yoco.com/api/checkouts', {
            amount: order.totalAmount * 100,
            currency: 'ZAR',
            successUrl: `${process.env.HOST_LINK}/#/payment-success?orderId=${orderId}`,
            cancelUrl: 'http://localhost:9000/#/payment-cancel',
            failureUrl: 'http://localhost:9000/#/payment-failure'
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.YOCO_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const checkout = response.data;
        // console.log('Checkout created:', checkout); // Log checkout creation

        return { checkout, order };

    } catch (error) {
        console.error('Error in CreateGatewayService:', error); // Log errors
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
