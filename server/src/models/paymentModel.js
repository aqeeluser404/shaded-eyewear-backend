const mongoose = require('mongoose')
var Schema = mongoose.Schema

const paymentSchema = new mongoose.Schema(
    {
        paymentAmount: {
            type: Number,
            required: true
        },
        paymentDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            default: 'pending'
        },
        description: {
            type: String,
            required: true
        },

        // Fk fields
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
    },
    { collection: 'Payment' }
)

module.exports = mongoose.model('Payment', paymentSchema)