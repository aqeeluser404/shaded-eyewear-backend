const express = require('express')
const router = express.Router()
const ShippingController = require('../src/controllers/shippingController')

router.get('/get-shipping-eta', ShippingController.GetShippingController)
router.get('/track-parcel', ShippingController.TrackParcelController)

module.exports = router