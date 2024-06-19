/*
    dependencies
*/
    require('dotenv').config();
    const jwtSecret = process.env.JWT_SECRET;
    const jwt = require('jsonwebtoken')
    const bcrypt = require('bcryptjs')
    const User = require('../models/userModel')
    const Order = require('../models/orderModel')
    const OrderType = require('../models/orderTypeModel')
/*
    ================================================================= authentication
*/
module.exports.UserRegisterService = async (userDetails) => {
    try {
        const existingUser = await User.findOne({ username: userDetails.username });
        if (existingUser) {
            throw new Error('Username already exists');
        }
        const userType = process.env.CREATE_ADMIN === 'true' ? 'admin' : 'user'; 
        const hashedPassword = await bcrypt.hash(userDetails.password, 10);

        const userModelData = new User({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phone: userDetails.phone,
            username: userDetails.username,
            password: hashedPassword,
            userType: userType,
            dateCreated: new Date()
        });

        await userModelData.save();
        return true;
    } catch (error) {
        throw error;
    }
}
module.exports.UserLoginService = async (username, email, password) => {
    try {
        // Search for user with username or email
        const user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        });
        if (!user) 
            throw new Error('User not found')
    
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) 
            throw new Error('Invalid password')

        // Update login status
        user.updateLoginStatus()
        
        const token = jwt.sign({ _id: user._id, userType: user.userType }, jwtSecret);
        return token;
    } catch (error) {
        throw error;
    }
}
module.exports.UserLogoutService = async (id) => {
    try {
        const user = await User.findById(id);
        if (!user) 
            throw new Error('User not found')
        
        // Update logout status
        user.logout();
        
        return 'User logged out successfully';
    } catch (error) {
        throw error;
    }
}
module.exports.FindUsersLoggedInService = async () => {
    try {
        const users = await User.find({ "loginInfo.isLoggedIn": true });
        return users;
    } catch (error) {
        throw error;
    }
}
module.exports.FindUsersFrequentlyLoggedInService = async () => {
    try {
        // Find all users and sort them by loginCount in descending order
        const users = await User.find().sort({ "loginInfo.loginCount": -1 });
        return users;
    } catch (error) {
        throw error;
    }
}
/*
    ================================================================= user services
*/
module.exports.FindUserByIdService = async (id) => {
    const user = await User.findById(id)
    if (!user) {
        throw new Error('User not found')
    }
    return user;
}
module.exports.FindUserByTokenService = async (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findById(decoded._id)
    if (!user) {
        throw new Error('User not found')
    }
    return user;
}
module.exports.CreateUserService = async (userDetails) => {
    const existingUser = await User.findOne({ username: userDetails.username });
    if (existingUser) {
        throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(userDetails.password, 10);

    const userModelData = new User({
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        email: userDetails.email,
        phone: userDetails.phone,
        username: userDetails.username,
        password: hashedPassword,
        userType: userDetails.userType, // specified by admin
        dateCreated: new Date()
    });

    await userModelData.save();
    return true;
}
module.exports.FindAllUsersService = async () => {
    const users = await User.find({})
    if (!users) {
        throw new Error('No users found')
    }
    return users;
}
module.exports.UpdateUserService = async (id, userDetails) => {
    if (userDetails.password) {
        userDetails.password = await bcrypt.hash(userDetails.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, userDetails, { new: true });
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}
module.exports.DeleteUserService = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) 
        throw new Error('User not found');

    // find order associated with user
    const orders = await Order.find({ user: id })

    // Delete the associated orders with ordertype
    for (let order of orders) {
        const orderType = await OrderType.findById(order.orderType)
        if (orderType) {
            await OrderType.deleteOne({ _id: order.orderType })
        }
        await Order.deleteOne({ _id: order._id });
    }
    return true;
}

// const crypto = require('crypto')
// const nodemailer = require('nodemailer')

// module.exports.UserForgotPasswordService = async (req, email) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             const user = await User.findOne({ email: email });
//             if (!user) {
//                 return reject('User not found');
//             }

//             // Create a password reset token
//             const resetToken = crypto.randomBytes(20).toString('hex');
//             const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

//             user.resetPasswordToken = resetToken;
//             user.resetPasswordExpires = resetTokenExpiry;

//             await user.save();

//             // Send the password reset token to the user's email using company details
//             const transporter = nodemailer.createTransport({
//                 service: 'Gmail',
//                 auth: {
//                     user: process.env.EMAIL_USERNAME,
//                     pass: process.env.EMAIL_PASSWORD
//                 }
//             })
//             const mailOptions = {
//                 to: user.email,
//                 from: 'passwordreset@demo.com',
//                 subject: 'Node.js Password Reset',
//                 text: `You are receiving this because you have requested the reset of the password for your account.\n\nPlease click on the following link, or paste this into your browser to complete the process:\n\nhttp://${req.headers.host}/reset/${resetToken}\n\nIf you did not request this, please ignore this email and your password will remain unchanged.\n`
//             };
//             transporter.sendMail(mailOptions)
//             .then(() => {
//                 resolve('An e-mail has been sent to ' + user.email + ' with further instructions.');
//             })
//             .catch((err) => {
//                 console.error("Failed to send email: ", err);
//                 reject('Failed to send email');
//             });
//         } 
//         catch (error) {
//             reject(error)
//         }
//     })
// }