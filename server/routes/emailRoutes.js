const express = require('express')
const router = express.Router()
const SendEmailController = require('../src/controllers/sendEmailController')

router.get('/verify-email', SendEmailController.VerifyEmailController)
router.post('/resend-verification-email', SendEmailController.ResendVerificationEmailController)

module.exports = router