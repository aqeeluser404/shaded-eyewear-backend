const express = require('express')
const router = express.Router();
const SunglassesController = require('../src/controllers/sunglassesController')
const { verifyToken, requireAdmin } = require('../middleware/authentication')
const upload = require('../middleware/multerConfig')

router.get('/sunglasses/view/:id', SunglassesController.FindSunglassesByIdController)
router.get('/sunglasses/all', SunglassesController.FindAllSunglassesController)

// admin routes
router.post('/admin/sunglasses/create', upload.array('images', 12), verifyToken, requireAdmin, SunglassesController.CreateSunglassesController)
router.put('/admin/sunglasses/update/:id', upload.array('images', 12), verifyToken, requireAdmin, SunglassesController.UpdateSunglassesController)
router.delete('/admin/sunglasses/delete/:id', verifyToken, requireAdmin, SunglassesController.DeleteSunglassesController)

module.exports = router