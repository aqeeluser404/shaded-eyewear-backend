

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
//     const imageUrls = [];
  
//     try {
//       if (req.files && req.files.length > 0) {
//         // Loop through files and send each one to Imgur
//         for (let i = 0; i < req.files.length; i++) {
//           const file = req.files[i];
  
//           // Prepare form data to send to Imgur
//           const form = new FormData();
//           form.append('image', file.buffer.toString('base64')); // Convert to base64
//           form.append('type', 'base64');

//           console.log('FormData:', form);
  
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

module.exports.CreateSunglassesController = async (req, res) => {
  const sunglassesDetails = req.body;
  const imageUrls = [];

  try {
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];

        const form = new FormData();
        form.append('image', file.buffer.toString('base64'));
        form.append('type', 'base64');

        console.log('FormData:', form);

        const response = await axios.post('https://api.imgur.com/3/image', form, {
          headers: {
            ...form.getHeaders(),
            Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
          },
        });

        imageUrls.push(response.data.data.link);
      }
      sunglassesDetails.images = imageUrls;
    } else {
      sunglassesDetails.images = [];
    }

    await SunglassesService.CreateSunglassesService(sunglassesDetails);

    res.status(201).json({ message: 'Sunglasses created successfully', images: sunglassesDetails.images });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      config: error.config,
      response: error.response ? {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      } : null
    });
    res.status(400).json({ error: error.message });
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