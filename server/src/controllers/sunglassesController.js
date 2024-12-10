

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
// Function to pause execution for a given number of milliseconds
const sleep = (milliseconds) => new Promise(resolve => setTimeout(resolve, milliseconds));

// Function to upload a single image to Imgur with exponential backoff and rate limit monitoring
const uploadImageToImgur = async (file, retries = 3, delay = 1000) => {
    const form = new FormData();
    form.append('image', file.buffer); // Use the buffer directly
    form.append('type', 'file'); // Indicate that it's a file buffer

    try {
        const response = await axios.post('https://api.imgur.com/3/image', form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${process.env.IMGUR_ACCESS_TOKEN}`, // Use your OAuth 2.0 access token here
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            timeout: 60000 // 60 seconds timeout
        });

        // Log rate limit headers
        console.log('Rate Limit:', response.headers['x-post-rate-limit-limit']);
        console.log('Rate Limit Remaining:', response.headers['x-post-rate-limit-remaining']);
        console.log('Rate Limit Reset:', response.headers['x-post-rate-limit-reset']);

        return response.data.data.link;
    } catch (error) {
        if (error.response && error.response.status === 429 && retries > 0) {
            console.log(`Rate limit exceeded, retrying after ${delay}ms...`);
            await sleep(delay);
            return uploadImageToImgur(file, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
};

module.exports.CreateSunglassesController = async (req, res) => {
    const { body: sunglassesDetails, files: sunglassesImg } = req;

    try {
        if (sunglassesImg && sunglassesImg.length > 0) {
            // Use Promise.all to process all uploads concurrently
            const uploadPromises = sunglassesImg.map(file => uploadImageToImgur(file));
            sunglassesDetails.images = await Promise.all(uploadPromises);
        } else {
            sunglassesDetails.images = [];
        }

        await SunglassesService.CreateSunglassesService(sunglassesDetails);

        res.status(201).json({ message: 'Sunglasses created successfully' });
    } catch (error) {
        console.error('Error uploading image to Imgur:', error.message);
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        }
        res.status(400).json({ error: 'An error occurred while uploading the image' });
    }
};

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