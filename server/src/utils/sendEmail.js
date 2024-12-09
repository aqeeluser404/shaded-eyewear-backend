const createMailTransporter = require('./createMailTransporter')

// VERIFY EMAIL
const verifyEmail = (user) => {
    const transporter = createMailTransporter();

    const verificationLink = `${process.env.HOST_LINK}/#/verify-email?token=${user.verification.verificationToken}`
    const mailOptions = {
        from: `Shaded Eyewear <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Verify Email',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Thank you for registering with Shaded Eyewear.</p>
            <p>
                Please click the link below to verify your email address.<br>
                <strong>Your email verification link: </strong><a href="${verificationLink}">Verify Email</a><br>
                If you did not create an account with us, please ignore this email.
            </p>
            <p>
                For enquiries you can email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>
            <p>
                Best regards,<br>
                Shaded Eyewear Team
            </p>
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

    const resetLink = `${process.env.HOST_LINK}/#/reset-password?token=${token}`
    const mailOptions = {
        from: `Shaded Eyewear <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: user.email,
        subject: 'Reset Password',
        html: `
            <p>Dear ${user.firstName},</p>
            <p>We received a request to reset your password.</p>
            <p>
                Please click the link below to create a new password.<br>
                <strong>Your reset password link: </strong><a href="${resetLink}">Reset Password</a><br>
                If you did not request to reset your password, please ignore this email.
            </p>
            <p>
                For enquiries you can email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>
            <p>
                Best regards,<br>
                Shaded Eyewear Team
            </p>
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
        subject: `Payment Confirmation | #${String(order._id).toUpperCase()}`,
        html: `
            <p>Dear ${user.firstName},</p>
            <p>Thank you for purchasing with us.</p>
            <p>
                Your order ID: <strong>#${(order._id)}</strong><br>
                Please bring this order confirmation email when you come to pick up your order.<br>
                Additionally, please keep this email as proof of purchase for any potential returns or refunds.
            </p>
            <p>
                <strong>Pickup Location</strong><br>
                65 Stockley Road<br>
                Kenwyn<br>
                Cape Town<br>
                7779<br><br>
                <strong>Our store is open from 8 AM to 5 PM.</strong>
            </p>
            <p>
                For enquiries please email us at <a href="mailto:${process.env.BUSINESS_EMAIL_ADDRESS}">${process.env.BUSINESS_EMAIL_ADDRESS}</a>
            </p>
            <p>
                Best regards,<br>
                The Shaded Eyewear Team
            </p>
        `
    }
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error.message);
        } else {
            console.log('Email sent successfully!');
        }
    });
};
const getInContactEmail = (user, message) => {
    const transporter = createMailTransporter()

    const mailOptions = {
        from: `Shaded Eyewear <${process.env.BUSINESS_EMAIL_ADDRESS}>`,
        to: process.env.BUSINESS_EMAIL_ADDRESS,
        subject: `Contact Form Submission from ${user.firstName} ${user.lastName}`,
        html: `
            <p>Dear Shaded Eyewear Team,</p>
            <p>You have received a new message from your contact form.</p>
            <p>
                <strong>Email received from: </strong>${user.firstName} ${user.lastName}<br>
                Message: "${message}"<br>
                Email: ${user.email}
            </p>
            <p>
                Best regards,<br>
                The Shaded Eyewear Team
            </p>
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

module.exports = { verifyEmail, sendResetEmail, pickupNotification, getInContactEmail }