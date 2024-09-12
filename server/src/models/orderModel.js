const mongoose = require('mongoose')
var Schema = mongoose.Schema

const orderSchema = new Schema(
    {
        orderDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            default: 'pending'
        },
        totalItems: {
            type: Number,
            required: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        deliveryDate: {
            type: Date,
            // default: 'pending'
        },

        // Fk fields
        sunglasses: [{
            _id: {
                type: Schema.Types.ObjectId,
                ref: 'Sunglasses',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }],
        payment: {
            type: Schema.Types.ObjectId,
            ref: 'Payment'
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        orderType: {
            type: Schema.Types.ObjectId,
            ref: 'OrderType'
        }
    }, { collection: 'Order' }
)

module.exports = mongoose.model('Order', orderSchema)