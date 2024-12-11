

// module.exports.CreateSunglassesController = async (req, res) => {
//     const sunglassesDetails = req.body;
//     if (req.files && req.files.length > 0) {
//       sunglassesDetails.images = req.files.map(file => file.path)
//     } else {
//       sunglassesDetails.images = []
//     }
//     try {
//       await SunglassesService.CreateSunglassesService(sunglassesDetails)
//       res.status(201).json({ message: 'Sunglasses created successfully' })
//     } catch (error) {
//       res.status(400).json({ error: error.message })
//     }
// }

const axios = require('axios');
const FormData = require('form-data');
const SunglassesService = require('../services/sunglassesService')

const ImageKit = require('imagekit');

const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const uploadImageToImageKit = async (file) => {
    try {
        const result = await imageKit.upload({
            file: file.buffer, // Use buffer directly for uploading
            fileName: file.originalname
        });
        return {
            imageUrl: result.url,
            fileId: result.fileId // Store this ID for deletion
        };
    } catch (error) {
        console.error('Error uploading image to ImageKit:', error.message);
        throw error;
    }
}
module.exports.CreateSunglassesController = async (req, res) => {
    const { body: sunglassesDetails, files: sunglassesImg } = req;

    try {
        if (sunglassesImg && sunglassesImg.length > 0) {
            const uploadPromises = sunglassesImg.map(file => uploadImageToImageKit(file));
            const uploadedImages = await Promise.all(uploadPromises);
            
            sunglassesDetails.images = uploadedImages.map(img => ({
                imageUrl: img.imageUrl,
                fileId: img.fileId
            }));
        } else {
            sunglassesDetails.images = [];
        }

        await SunglassesService.CreateSunglassesService(sunglassesDetails);

        res.status(201).json({ message: 'Sunglasses created successfully' });
    } catch (error) {
        console.error('Error uploading image:', error.message);
        res.status(400).json({ error: 'An error occurred while uploading the image' });
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