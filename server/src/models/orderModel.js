const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const orderSchema = new Schema(
    {
        orderDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'paid'],
            default: 'pending'
        },
        totalAmount: {
            type: Number,
            required: true
        },
        deliveryDate: {
            type: Date
        },

        // <-----------------------------------------------------------> FKID FIELD
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sunglasses: [{
            type: Schema.Types.ObjectId,
            ref: 'Sunglasses',
            required: true
        }],
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        },
        orderType: {
            type: Schema.Types.ObjectId,
            ref: 'OrderType'
        }
    }, { collection: 'Order' }
)

module.exports = mongoose.model('Order', orderSchema);