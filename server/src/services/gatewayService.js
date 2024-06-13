// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const Order = require('./orderService')

module.exports.CreateGatewayService = async (orderId, source) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Fetch order
            const order = await Order.FindOrderByIdService(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            const charge = await stripe.charges.create({
                amount: order.totalAmount,
                currency: 'zar',
                source: source,
                description: `Charge for order ${order._id}`,
            });

            // Update the order status after a successful charge
            order.status = 'paid';
            await order.save();

            resolve({ charge, order });
        } catch (error) {
            reject(error);
        }
    });
}

// There are several payment gateways in South Africa that you might consider as alternatives to Stripe123. Here are a few examples:

// PayFast: PayFast is an established payment gateway that powers more than 80K merchants in South Africa1. PayFast can be set up in a few simple steps and it is the easiest payment gateway for those looking to start1. The main advantage of PayFast is that it offers multiple different payment methods, including Credit and Cheque Cards, EFTs with most of the main South African banks, Integration with Zapper and SnapScan, as well as Mobicred, Scode, and Masterpass1.
// Peach Payments: Peach Payments, which have offices in both Cape Town and Johannesburg, allow any business that sells goods or services digitally to accept payments online2.
// Yoco: Yoco is a Payment Gateway best known for its widely used credit machines, making it simple for users to get paid and grow their business1.
// Ozow: Ozow is offered by the biggest and most trusted brands in South Africa1.
// Zapper: Zapper is popular for eCommerce platform integration1.
// SnapScan: SnapScan offers SnapCodes, SnapLinks, the SnapStore app1.
// Each of these services will have their own APIs and SDKs that you can use to replace the stripe.charges.create() call in your code. You would need to refer to the respective service’s documentation for the exact details on how to do this.

// Remember, it’s always a good idea to refer to the official documentation of the payment gateway you’re using for the most accurate and detailed information.
