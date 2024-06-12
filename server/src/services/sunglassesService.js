const Sunglasses = require('../models/sunglassesModel')
const path = require('path')
const fs = require('fs');

module.exports.CreateSunglassesService = async (sunglassesDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingSunglasses = await Sunglasses.findOne({ model: sunglassesDetails.model });
            if (existingSunglasses) {
                return reject('Model already exists')
            }
            const sunglassesModelData = new Sunglasses()

            sunglassesModelData.model = sunglassesDetails.model
            sunglassesModelData.description = sunglassesDetails.description
            sunglassesModelData.color = sunglassesDetails.color
            sunglassesModelData.price = sunglassesDetails.price
            sunglassesModelData.stock = sunglassesDetails.stock
            sunglassesModelData.images = sunglassesDetails.images

            sunglassesModelData.save()
                .then((result) => {
                    resolve(true)
                })
                .catch((error) => {
                    reject(false)
                })
        } catch (error) {
            reject(error);
        }
    })
}
module.exports.FindSunglassesByIdService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sunglasses = await Sunglasses.findById(id);
            if (!sunglasses) {
                return reject('Sunglasses not found');
            }
            resolve(sunglasses);
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.FindAllSunglassesService = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const sunglasses = await Sunglasses.find();
            resolve(sunglasses);
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.UpdateSunglassesService = async (id, sunglassesDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sunglasses = await Sunglasses.findById(id);
            if (!sunglasses) {
                return reject('Sunglasses not found');
            }
            sunglasses.model = sunglassesDetails.model || sunglasses.model;
            sunglasses.description = sunglassesDetails.description || sunglasses.description;
            sunglasses.color = sunglassesDetails.color || sunglasses.color;
            sunglasses.price = sunglassesDetails.price || sunglasses.price;
            sunglasses.stock = sunglassesDetails.stock || sunglasses.stock;

            // Add new images to the images array
            if (sunglassesDetails.images) {
                sunglassesDetails.images.forEach(image => sunglasses.images.push(image));
            }

            const updatedSunglasses = await sunglasses.save();
            resolve(updatedSunglasses);
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.DeleteSunglassesService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sunglasses = await Sunglasses.findById(id);
            if (!sunglasses) {
                return reject('Sunglasses not found');
            }
            
            // Delete the image files
            sunglasses.images.forEach(imagePath => {
                const uploadsPath = path.join(imagePath);
                fs.unlink(uploadsPath, err => {
                    if (err) {
                        console.error(`Failed to delete file: ${uploadsPath}`);
                    }
                });
            });
            
            // Delete the sunglasses from the database
            await Sunglasses.findByIdAndDelete(id);
            resolve(true);
        } 
        catch (error) {
            reject(error);
        }
    });
}
