const express = require('express')
const router = express.Router();
const SunglassesController = require('../src/controllers/sunglassesController')
const { verifyToken, requireAdmin } = require('../middleware/authentication');

// admin routes
router.post('/admin/sunglasses/create', verifyToken, requireAdmin, SunglassesController.CreateSunglassesController)
router.put('/admin/sunglasses/update/:id', verifyToken, requireAdmin, SunglassesController.UpdateSunglassesController)
router.delete('/admin/sunglasses/delete/:id', verifyToken, requireAdmin, SunglassesController.DeleteSunglassesController)

// public routes
router.get('/sunglasses/view/:id', SunglassesController.FindSunglassesByIdController)
router.get('/sunglasses/all', SunglassesController.FindAllSunglassesController)

module.exports = router;