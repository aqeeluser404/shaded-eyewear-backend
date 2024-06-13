const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const paymentSchema = new mongoose.Schema(
    {
        paymentAmount: {
            type: Number,
            required: true
        },
        // currency
        paymentDate: {
            type: Date,
            required: true
        },
        status: {
            type: String,
            // enum: ['pending', 'processing', 'paid', 'unpaid'],
            default: 'pending'
        },
        description: {
            type: String,
            required: true
        },
        // paymentMethod: {
        //     type: String,
        //     required: true
        // },

        // <-----------------------------------------------------------> FKID FIELD
        order: {
            type: Schema.Types.ObjectId,
            ref: 'Order',
            required: true
        },
    },
    { collection: 'Payment' }
)

module.exports = mongoose.model('Payment', paymentSchema);