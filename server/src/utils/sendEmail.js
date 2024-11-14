const createMailTransporter = require('./createMailTransporter')

// VERIFY EMAIL
const verifyEmail = (user) => {
    const transporter = createMailTransporter();

    const verificationLink = `http://localhost:9000/#/verify-email?token=${user.verification.verificationToken}`
    const mailOptions = {
        from: `Shaded Eyewear <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Verify Email',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Thank you for registering with Shaded Eyewear. Please click the link below to verify your email address:</p>
            <p><a href="${verificationLink}">Verify Email</a></p>
            <p>If you did not create an account, please ignore this email.</p>
            <p>For enquiries please email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a></p>
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
// PASSWORD RESET EMAIL
const sendResetEmail = (user, token) => {
    const transporter = createMailTransporter()

    const resetLink = `http://localhost:9000/#/reset-password?token=${token}`
    const mailOptions = {
        from: `Shaded Eyewear <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Reset Password',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Please click the link below to reset your password:</p>
            <p><a href="${resetLink}">Reset Password</a></p>
            <p>If you did not request to reset your password, please ignore this email.</p>
            <p>For enquiries please email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a></p>
            <p>Best regards,</p>
            <p>Shaded Eyewear Team</p>
        `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent successfully!');
        }
    })
}
const pickupNotification = (user, order) => {
    const transporter = createMailTransporter();

    const mailOptions = {
        from: `Shaded Eyewear <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: `Payment Confirmation | ${order._id}`,
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Thank you for purchasing with us.</p>
            <p>Your Shaded Eyewear order <strong>#${order._id}</strong></p>
            <p>Please bring this order confirmation email when you come to pick up your order. Our store is open from 8 AM to 5 PM, Monday to Saturday.</p>
            <p>Best regards,</p>
            <p>The Shaded Eyewear Team</p>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent successfully!');
        }
    });
};

// const purchaseNotification = (user, order) => {
//     const transporter = createMailTransporter()

//     const mailOptions = {
//         from: `Shaded Eyewear <noreply@${process.env.HOST_LINK}>`,
//         to: user.email,
//         subject: `Payment Confirmation | ${order._id} `
//     }
// }

module.exports = { verifyEmail, sendResetEmail, pickupNotification }