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
        orderType: {
            type: String,
            enum: ['pickup', 'delivery', 'pending'],
            required: true
        },

        returns: {
            type: String,
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
        deliveryStatus: {
            type: Schema.Types.ObjectId,
            ref: 'DeliveryStatus'
        },
        originalOrder: {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    }, { collection: 'Order' }
)

module.exports = mongoose.model('Order', orderSchema)