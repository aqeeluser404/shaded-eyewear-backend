const SunglassesService = require('../services/sunglassesService')

module.exports.CreateSunglassesController = async (req, res) => {
    try {
        const sunglassesDetails = req.body;
        sunglassesDetails.images = req.files.map(file => file.path);
        await SunglassesService.CreateSunglassesService(sunglassesDetails);
        res.status(201).send('Sunglasses created successfully');
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports.FindSunglassesByIdController = async (req, res) => {
    try {
        const sunglasses = await SunglassesService.FindSunglassesByIdService(req.params.id);
        res.status(200).json(sunglasses);
    }
    catch (error) {
        res.status(404).send(error.message);
    }
}
module.exports.FindAllSunglassesController = async (req, res) => {
    try {
        const sunglasses = await SunglassesService.FindAllSunglassesService();
        res.status(200).json(sunglasses);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
}
module.exports.UpdateSunglassesController = async (req, res) => {
    try {
        const sunglassesDetails = req.body;
        if (req.files) {
            sunglassesDetails.images = req.files.map(file => file.path);
        }
        
        const sunglasses = await SunglassesService.UpdateSunglassesService(req.params.id, sunglassesDetails);
        res.status(200).json(sunglasses);
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}
module.exports.DeleteSunglassesController = async (req, res) => {
    try {
        await SunglassesService.DeleteSunglassesService(req.params.id);
        res.status(200).send('Sunglasses deleted successfully');
    }
    catch (error) {
        res.status(404).send(error.message);
    }
}
