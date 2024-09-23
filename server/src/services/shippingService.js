const axios = require('axios')

const apiKey = process.env.FASTWAY_API_KEY
const baseUrl = 'https://api.fastway.org/v7'

const GetShippingService = async (origin, destination) => {
    try {
        const response = await axios.get(`${baseUrl}/etacalculator`, {
            params: {
                api_key: apiKey,
                origin: {
                    address1: origin.address1,
                    suburb: origin.suburb,
                    city: origin.city,
                    state: origin.state,
                    postcode: origin.postcode
                },
                destination: {
                    address1: destination.streetAddress,
                    suburb: destination.suburb,
                    city: destination.city,
                    state: destination.province,
                    postcode: destination.postalCode
                }
            }
        }) 
        return response.data
    } catch (error) {
        console.error('Error fetching ETA:', error);
        throw error
    }
}
const TrackParcelService = async (trackingNumber) => {
    try {
        const response = await axios.get(`${baseUrl}/tracktrace`, {
            params: {
                api_key: apiKey,
                tracking_number: trackingNumber
            }
        })
        return response.data
    } catch (error) {
        console.error('Error tracking parcel:', error);
        throw error;
    }
    
}

module.exports = { GetShippingService, TrackParcelService }