const createMailTransporter = require('./createMailTransporter')
const crypto = require('crypto');

const verifyEmail = (user) => {
    const transporter = createMailTransporter();

    const verificationLink = `http://localhost:9000/#/verify-email?token=${user.verification.verificationToken}`

    const mailOptions = {
        from: `Shaded Eyewear <${process.env.EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Verify Email',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Thank you for registering with Shaded Eyewear. Please click the link below to verify your email address:</p>
            <p><a href="${verificationLink}">Verify Email</a></p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>Best regards,</p>
            <p>Shaded Eyewear Team</p>
        `
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message)
        } else {
            console.log('Email sent successfully!')
        }
    })
}

const generateResetToken = () => {
    return crypto.randomBytes(20).toString('hex')
}

const sendResetEmail = (user, token) => {
    const transporter = createMailTransporter()

    const resetLink = `http://localhost:9000/#/reset-password?token=${token}`;

    const mailOptions = {
        from: `Shaded Eyewear <${process.env.EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Reset Password',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Please click the link below to reset your password:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>If you did not request to reset your password, please ignore this email.</p>
            <p>Best regards,</p>
            <p>Shaded Eyewear Team</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent successfully!');
        }
    })
}

const purchaseNotification = (user, order) => {
    const transporter = createMailTransporter()

    const mailOptions = {
        from: `Shaded Eyewear <${process.env.EMAIL_ADDRESS}>`,
        to: user.email,
        subject: `Payment Confirmation | ${order._id} `
    }
}

module.exports = { verifyEmail, generateResetToken, sendResetEmail }