const ShippingService = require('../services/shippingService')
const Order = require('../models/orderModel')

module.exports.GetShippingController = async (req, res) => {
    try {
        // company address example
        const originAddress = {
            address1: '123 Main St',  // Street Address
            suburb: 'Lotus River',   // Suburb
            city: 'Cape Town',       // City
            state: 'Western Cape',   // Province/State
            postcode: '8001'         // Postal Code
        }
        
        const { user, orderId } = req.body
        const destinationAddress = {
            address1: user.location.streetAddress,
            suburb: user.location.suburb,
            city: user.location.city,
            state: user.location.province,
            postcode: user.location.postalCode.toString()
        }

        const shipping = await ShippingService.GetShippingService(originAddress, destinationAddress)
        console.log('Shipping created:', shipping)

        // Update the order with tracking number
        await Order.findByIdAndUpdate(orderId, {trackingNumber: shipping.tracking_number, status: 'Shipped' })

        res.status(200).json({ shipping })
    } catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}
module.exports.TrackParcelController = async (req, res) => {
    try {

        const { orderId } = req.body
        const order = await Order.findById(orderId)

        if (!order || !order.trackingNumber) {
            return res.status(404).json({ error: 'Order or tracking number not found' });
        }

        const trackingInfo = await ShippingService.TrackParcelService(order.trackingNumber)
        console.log('Tracking info:', trackingInfo)

        res.status(200).json({ trackingInfo })
    } catch (error) {
        res.status(500).json({ error: error.toString() })
    }
}