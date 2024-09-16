const { generateVerificationToken } = require('../../middleware/authentication')
const User = require('../models/userModel')
const { verifyEmail } = require('../utils/sendEmail')
const jwt = require('jsonwebtoken')

module.exports.VerifyEmailController = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).send('Token is required.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId, 'verification.verificationToken': token });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        if (user.verification.verificationTokenExpires < Date.now()) {
            return res.status(400).send('Token has expired.');
        }

        user.verification.isVerified = true;
        user.verification.verificationToken = undefined;
        user.verification.verificationTokenExpires = undefined;
        await user.save();

        res.send('Email verified successfully!');
    } catch (error) {
        console.error('Error verifying email:', error);
        res.status(500).send('Error verifying email.');
    }
}

module.exports.ResendVerificationEmailController = async (req, res) => {
    try {
        const { email } = req.body
        const user = await User.findOne({ email: email })
        console.log(user)
        if (!user) {
            return res.status(404).send('User not found.')
        }

        if (user.verification.isVerified) {
            return res.status(400).send('Email is already verified.')
        }

        // Generate new verification token
        const verificationToken = generateVerificationToken(user)
        user.verification.verificationToken = verificationToken
        user.verification.verificationTokenExpires = Date.now() + 3600000 // 1 hour
        await user.save()

        // Send verification email
        verifyEmail(user, verificationToken)

        res.send('Verification email resent.')
    } catch (error) {
        res.status(500).send('Error resending verification email.')
    }
}