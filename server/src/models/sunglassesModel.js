const mongoose = require('mongoose');

const sunglassesSchema = new mongoose.Schema(
    {
        model: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        stock: {
            type: Number,
            required: true
        }
    }, { collection: 'Sunglasses' }
)

module.exports = mongoose.model('Sunglasses', sunglassesSchema);