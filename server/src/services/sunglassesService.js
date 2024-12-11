// const path = require('path')
// const fs = require('fs');
const Sunglasses = require('../models/sunglassesModel')
const ImageKit = require('imagekit');

module.exports.CreateSunglassesService = async (sunglassesDetails) => {
    try {
        const existingSunglasses = await Sunglasses.findOne({ model: sunglassesDetails.model })
        if (existingSunglasses) {
            throw new Error('Model already exists')
        }

        const sunglassesModelData = new Sunglasses({
            model: sunglassesDetails.model,
            description: sunglassesDetails.description,
            color: sunglassesDetails.color,
            price: sunglassesDetails.price,
            stock: sunglassesDetails.stock,
            images: sunglassesDetails.images
        })

        await sunglassesModelData.save()
        return true
    } catch (error) {
        throw(error)
    }
}
module.exports.FindSunglassesByIdService = async (id) => {
    const sunglasses = await Sunglasses.findById(id)
    if (!sunglasses) {
        throw new Error('Sunglasses not found')
    }
    return sunglasses;
}
module.exports.FindAllSunglassesService = async () => {
    const sunglasses = await Sunglasses.find({})
    if (!sunglasses) {
        throw new Error('No sunglasses found')
    }
    return sunglasses
}
module.exports.UpdateSunglassesService = async (id, sunglassesDetails) => {
    
    // First, update the sunglasses without the images
    const { images, ...detailsWithoutImages } = sunglassesDetails
    
    let sunglasses = await Sunglasses.findByIdAndUpdate(id, detailsWithoutImages, { new: true })
    if (!sunglasses) {
        throw new Error('Sunglasses not found')
    }
    // Then, if there are new images, add them to the sunglasses
    if (images) {
        images.forEach(image => sunglasses.images.push(image))
        sunglasses = await sunglasses.save()
    }
    return sunglasses
}
// module.exports.DeleteSunglassesService = async (id) => {
//     const sunglasses = await Sunglasses.findById(id)
//     if (!sunglasses) {
//         throw new Error('Sunglasses not found')
//     }
//     // Delete the image files
//     for (const imagePath of sunglasses.images) {
//         const uploadsPath = path.join(imagePath)
//         fs.unlink(uploadsPath, err => {
//             if (err) {
//                 console.error(`Failed to delete file: ${uploadsPath}`)
//             }
//         });
//     }
//     // Delete the sunglasses from the database
//     await Sunglasses.findByIdAndDelete(id);

//     return true;
// }

// module.exports.DeleteSunglassesService = async (id) => {
//     const sunglasses = await Sunglasses.findById(id);
//     if (!sunglasses) {
//         throw new Error('Sunglasses not found');
//     }

//     // Delete the images from ImgBB
//     for (const image of sunglasses.images) {
//         if (image.deleteUrl) { // Check if deleteUrl exists
//             try {
//                 console.log(`Attempting to delete image: ${image.deleteUrl}`);
//                 const response = await axios.delete(image.deleteUrl);
//                 console.log(`Deleted image from ImgBB: ${image.imageUrl}`);
//                 console.log(`Response status: ${response.status}`);
//             } catch (error) {
//                 console.error(`Failed to delete image from ImgBB: ${image.imageUrl}`, error.message);
//                 console.error(`Error details:`, error.response ? error.response.data : 'No response data');
//             }
//         }
//     }

//     // Delete the sunglasses from the database
//     await Sunglasses.findByIdAndDelete(id);

//     return true;
// };

const imageKit = new ImageKit({ 
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY, 
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY, 
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const deleteImageFromImageKit = async (fileId) => {
    try {
        const response = await imageKit.deleteFile(fileId);
        console.log(`Deleted image from ImageKit: ${fileId}`);
    } catch (error) {
        console.error(`Failed to delete image from ImageKit: ${fileId}`, error.message);
        console.error(`Error details:`, error.response ? error.response.data : 'No response data');
    }
};

module.exports.DeleteSunglassesService = async (id) => {
    const sunglasses = await Sunglasses.findById(id);
    if (!sunglasses) {
        throw new Error('Sunglasses not found');
    }

    // Delete the images from ImageKit
    for (const image of sunglasses.images) {
        if (image.fileId) {
            await deleteImageFromImageKit(image.fileId);
        }
    }

    // Delete the sunglasses from the database
    await Sunglasses.findByIdAndDelete(id);

    return true;
};