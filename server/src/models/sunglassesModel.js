const mongoose = require('mongoose')

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
        },
        // images: {
        //     type: [String],
        //     required: false
        // },
        images: [{
            imageUrl: { type: String, required: false },
            fileId: { type: String, required: false }
        }]
    }, { collection: 'Sunglasses' }
)

module.exports = mongoose.model('Sunglasses', sunglassesSchema)