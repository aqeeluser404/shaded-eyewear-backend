/*
    dependencies
*/
    // const Paystack = require('paystack')(process.env.PAYSTACK_SECRET_KEY);
    const User = require('./userService')
    const Order = require('./orderService')
    const Payment = require('../models/paymentModel')
/*
    ================================================================= // SERVICES
*/
    // -------------------------------------------------------------- PAYMENT
    module.exports.CreateGatewayService = async (orderId) => {
        try {
            // Fetch order
            const order = await Order.FindOrderByIdService(orderId);
            if (!order) {
                throw new Error('Order not found');
            }

            // Fetch user
            const user = await User.FindUserByIdService(order.user); 
            if (!user) {
                throw new Error('User not found');
            }

            // (TEMPORARY EXAMPLE PLACEHOLDER) Payment gateway code
            const payment = new Payment({
                paymentAmount: order.totalAmount,
                currency: 'ZAR',
                paymentDate: Date.now(),
                status: 'paid',
                description: 'this item has been paid for',
                order: order._id
            });

            await payment.save();

            // update order details
            order.payment = payment._id
            order.status = 'paid';
            await order.save();

            return { payment, order };

            // Payment gateway code
            // const charge = await Paystack.transaction.initialize({
            //     email: user.email,
            //     amount: order.totalAmount * 100,
            //     currency: 'ZAR',
            //     reference: `${order._id}`,
            // });

            // // Update the order status after a successful charge
            // if (charge.status === 'SUCCESSFUL') {
            //     order.status = 'paid';
            //     order.payment = payment._id
            //     await order.save();
            // }

            // return { charge, order };
        } catch (error) {
            throw error;
        }
    }

// On frontend

// in index file
// {/* <script src="https://js.paystack.co/v1/inline.js"></script> */}

// on the form
// methods: {
//     onPayButtonClick() {
//       // Collect necessary information (like email and amount)
//       const email = this.email;
//       const amount = this.amount;
  
//       // Initialize the Paystack transaction
//       var handler = PaystackPop.setup({
//         key: 'your_public_key', // Replace with your public key
//         email: email,
//         amount: amount * 100, // amount in kobo
//         currency: "ZAR", // currency
//         ref: ''+Math.floor((Math.random() * 1000000000) + 1), // generates a pseudo-unique reference
//         callback: function(response) {
//             // Perform action on successful payment (e.g., send the response to your server)
//         },
//         onClose: function() {
//             // Perform action when the Paystack Inline modal is closed
//         }
//       });
  
//       // Open the Paystack Inline modal
//       handler.openIframe();
//     }
//   }
  

// There are several payment gateways in South Africa that you might consider as alternatives to Stripe123. Here are a few examples:

// PayFast: PayFast is an established payment gateway that powers more than 80K merchants in South Africa1. PayFast can be set up in a few simple steps and it is the easiest payment gateway for those looking to start1. The main advantage of PayFast is that it offers multiple different payment methods, including Credit and Cheque Cards, EFTs with most of the main South African banks, Integration with Zapper and SnapScan, as well as Mobicred, Scode, and Masterpass1.
// Peach Payments: Peach Payments, which have offices in both Cape Town and Johannesburg, allow any business that sells goods or services digitally to accept payments online2.
// Yoco: Yoco is a Payment Gateway best known for its widely used credit machines, making it simple for users to get paid and grow their business1.
// Ozow: Ozow is offered by the biggest and most trusted brands in South Africa1.
// Zapper: Zapper is popular for eCommerce platform integration1.
// SnapScan: SnapScan offers SnapCodes, SnapLinks, the SnapStore app1.
// Each of these services will have their own APIs and SDKs that you can use to replace the stripe.charges.create() call in your code. You would need to refer to the respective service’s documentation for the exact details on how to do this.

// Remember, it’s always a good idea to refer to the official documentation of the payment gateway you’re using for the most accurate and detailed information.
