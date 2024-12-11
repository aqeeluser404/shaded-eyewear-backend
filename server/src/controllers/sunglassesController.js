

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

// module.exports.CreateSunglassesController = async (req, res) => {
//     const sunglassesDetails = req.body;
//     const sunglassesImg = req.files;
//     const imageUrls = [];
//     console.log(sunglassesDetails)
//     console.log(sunglassesImg)
//     try {
//       if (req.files && req.files.length > 0) {
//         // Loop through files and send each one to Imgur
//         for (let i = 0; i < req.files.length; i++) {
//           const file = req.files[i];

//           await new Promise(resolve => setTimeout(resolve, 1000));
  
//           // Prepare form data to send to Imgur
//           const form = new FormData();
//           form.append('image', file.buffer.toString('base64')); // Convert to base64
//           form.append('type', 'base64');
  
//           // Send the image to Imgur
//           const response = await axios.post('https://api.imgur.com/3/image', form, {
//             headers: {
//               ...form.getHeaders(),
//               Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`, // Use your Imgur Client ID here
//             },
//           });
  
//           // Store the Imgur image URL
//           imageUrls.push(response.data.data.link);
//         }
  
//         sunglassesDetails.images = imageUrls;
//       } else {
//         sunglassesDetails.images = [];
//       }
  
//       await SunglassesService.CreateSunglassesService(sunglassesDetails);
  
//       res.status(201).json({ message: 'Sunglasses created successfully' });
//     } catch (error) {
//       console.error('Error uploading image to Imgur:', error);
//       res.status(400).json({ error: error.message });
//     }
// }

// Function to upload a single image to ImgBB
// const uploadImageToImgBB = async (file, apiKey) => {
//     const form = new FormData();
//     const base64Image = Buffer.from(file.buffer).toString('base64')
//     form.append('image', base64Image);
//     form.append('key', apiKey); // Your API key

//     try {
//         const response = await axios.post('https://api.imgbb.com/1/upload', form, {
//             headers: {
//                 ...form.getHeaders(),
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             maxContentLength: Infinity,
//             maxBodyLength: Infinity,
//             timeout: 60000 // 60 seconds timeout
//         });

//         return { 
//           imageUrl: response.data.data.url, 
//           deleteUrl: response.data.data.delete_url 
//         }
//     } catch (error) {
//         console.error('Error uploading image to ImgBB:', error.message);
//         throw error;
//     }
// };
// module.exports.CreateSunglassesController = async (req, res) => {
//     const { body: sunglassesDetails, files: sunglassesImg } = req;

//     try {
//         if (sunglassesImg && sunglassesImg.length > 0) {
//             // Use Promise.all to process all uploads concurrently
//             const apiKey = process.env.IMGBB_API_KEY
//             const uploadPromises = sunglassesImg.map(file => uploadImageToImgBB(file, apiKey)); 
//             const uploadedImages = await Promise.all(uploadPromises); 
//             sunglassesDetails.images = uploadedImages.map(img => ({ imageUrl: img.imageUrl, deleteUrl: img.deleteUrl }));

//         } else {
//             sunglassesDetails.images = [];
//         }

//         await SunglassesService.CreateSunglassesService(sunglassesDetails);

//         res.status(201).json({ message: 'Sunglasses created successfully' });
//     } catch (error) {
//         console.error('Error uploading image:', error.message);
//         if (error.response) {
//             console.error(`Status: ${error.response.status}`);
//             console.error(`Data: ${JSON.stringify(error.response.data)}`);
//         }
//         res.status(400).json({ error: 'An error occurred while uploading the image' });
//     }
// };

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