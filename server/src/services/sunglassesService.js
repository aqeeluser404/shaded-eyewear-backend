const Sunglasses = require('../models/sunglassesModel')

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
            const sunglasses = await Sunglasses.findByIdAndUpdate(id, sunglassesDetails, { new: true });
            if (!sunglasses) {
                return reject('Sunglasses not found');
            }
            resolve(sunglasses);
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.DeleteSunglassesService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const sunglasses = await Sunglasses.findByIdAndDelete(id);
            if (!sunglasses) {
                return reject('Sunglasses not found');
            }
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}
