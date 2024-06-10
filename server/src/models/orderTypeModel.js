const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const orderTypeSchema = new Schema(
    {
        type: {
            type: String,
            enum: ['pickup', 'delivery'],
            required: true
        },
        priceThreshold: {
            type: Number,
            required: true
        },
    }, { collection: 'OrderType' }
);

module.exports = mongoose.model('OrderType', orderTypeSchema);