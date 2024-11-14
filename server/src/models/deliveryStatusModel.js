const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const deliveryStatusSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['free delivery', 'charge for delivery', 'pickup'],
            required: true
        },
        deliveryAmount: {
            type: Number,
        },
        priceThreshold: {
            type: Number,
        },
        deliveryDate: {
            type: Date,
        },
        trackingNumber: {
            type: String,
            default: ''
        },
    }, { collection: 'DeliveryStatus' }
);

module.exports = mongoose.model('DeliveryStatus', deliveryStatusSchema)