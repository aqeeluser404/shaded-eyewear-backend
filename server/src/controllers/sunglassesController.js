
const SunglassesService = require('../services/sunglassesService')

module.exports.CreateSunglassesController = async (req, res) => {
    const sunglassesDetails = req.body;
    if (req.files && req.files.length > 0) {
      sunglassesDetails.images = req.files.map(file => file.path)
    } else {
      sunglassesDetails.images = []
    }
    try {
      await SunglassesService.CreateSunglassesService(sunglassesDetails)
      res.status(201).json({ message: 'Sunglasses created successfully' })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
}
module.exports.FindSunglassesByIdController = async (req, res) => {
    const { id } = req.params
    try {
        const sunglasses = await SunglassesService.FindSunglassesByIdService(id)
        res.status(200).json(sunglasses)
    }
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}
module.exports.FindAllSunglassesController = async (req, res) => {
    try {
        const sunglasses = await SunglassesService.FindAllSunglassesService()
        res.status(200).json(sunglasses)
    }
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}
module.exports.UpdateSunglassesController = async (req, res) => {
    const { id } = req.params
    const sunglassesDetails = req.body
    try {
        if (req.files) {
            sunglassesDetails.images = req.files.map(file => file.path)
        }
        await SunglassesService.UpdateSunglassesService(id, sunglassesDetails)
        res.status(200).json({ message: 'Sunglasses updated successfully' })
    }
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}
module.exports.DeleteSunglassesController = async (req, res) => {
    try {
        await SunglassesService.DeleteSunglassesService(req.params.id)
        res.status(200).json({ message: 'Sunglasses deleted successfully' })
    }
    catch (error) {
        res.status(404).json({ error: error.message })
    }
}

// module.exports.CreateSunglassesController = async (req, res) => {
//     const sunglassesDetails = req.body;
//     sunglassesDetails.images = req.files.map(file => file.path);
//     try {
//         await SunglassesService.CreateSunglassesService(sunglassesDetails);
//         res.status(201).json({ message: 'Sunglasses created successfully' });
//     }
//     catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// }