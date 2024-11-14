const express = require('express')
const router = express.Router()
const SendEmailController = require('../src/controllers/sendEmailController')

router.get('/verify-email', SendEmailController.VerifyEmailController)
router.post('/resend-verification-email', SendEmailController.ResendVerificationEmailController)
router.post('/forgot-password', SendEmailController.ForgotPasswordController)
router.post('/reset-password', SendEmailController.ResetPasswordController)
router.post('/contact', SendEmailController.GetInContactController)

module.exports = router