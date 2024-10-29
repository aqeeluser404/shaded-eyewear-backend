const nodemailer = require('nodemailer')

const createMailTransporter = () => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.HOST_EMAIL_ADDRESS,
            pass: process.env.HOST_EMAIL_PASSWORD
        }
    })
    return transporter
}

module.exports = createMailTransporter