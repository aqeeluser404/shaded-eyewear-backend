require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')
const Order = require('../models/orderModel')
// const OrderType = require('../models/deliveryStatusModel')
const DeliveryStatus = require('../models/deliveryStatusModel');
// const { generateVerificationToken } = require('../../middleware/authentication')
const { verifyEmail } = require('../utils/sendEmail')

module.exports.UserRegisterService = async (userDetails) => {
    try {
        const existingUser = await User.findOne({
            $or: [
                { username: userDetails.username },
                { email: userDetails.email }
            ]
        })
        if (existingUser) {
            throw new Error('Username already exists')
        }
        const userType = process.env.CREATE_ADMIN === 'true' ? 'admin' : 'user';
        const hashedPassword = await bcrypt.hash(userDetails.password, 10)

        const userModelData = new User({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            email: userDetails.email,
            phone: userDetails.phone,
            username: userDetails.username,
            password: hashedPassword,
            userType: userType,
            dateCreated: new Date()
        })

        // generate email token
        const verificationToken = jwt.sign({ userId: userModelData._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        userModelData.verification = {
            isVerified: false,
            verificationToken: verificationToken,
            // verificationTokenExpires: Date.now() + 3600000          // 1 hour
            verificationTokenExpires: Date.now() + 86400000            // 24 hours
        }
        await userModelData.save()

        // Send verification email
        verifyEmail(userModelData)

        return true;
    } catch (error) {
        throw error;
    }
}
module.exports.UserLoginService = async (username, email, password) => {
    try {
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
        
        const token = jwt.sign({ _id: user._id, userType: user.userType }, jwtSecret, { expiresIn: '24h' });
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
    const existingUser = await User.findOne({ username: userDetails.username })
    if (existingUser) {
        throw new Error('Username already exists')
    }

    const hashedPassword = await bcrypt.hash(userDetails.password, 10)

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

    const currentUser = await User.findById(id)
    if (!currentUser) {
        throw new Error('User not found')
    }
    const isEmailUpdated = userDetails.email && userDetails.email !== currentUser.email

    const user = await User.findByIdAndUpdate(id, userDetails, { new: true });
    if (!user) {
        throw new Error('User not found');
    }

    if (isEmailUpdated) {
        user.verification.isVerified = false
        // generate email token
        const verificationToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        user.verification.verificationToken = verificationToken
        user.verification.verificationTokenExpires = Date.now() + 3600000                   // 1 hour
    }

    await user.save()
    return user
}
module.exports.DeleteUserService = async (id) => {
    const user = await User.findByIdAndDelete(id);
    if (!user) 
        throw new Error('User not found');

    // find order associated with user
    const orders = await Order.find({ user: id })

    // Delete the associated orders with deliverystatus
    for (let order of orders) {
        const deliveryStatus = await DeliveryStatus.findById(order.deliveryStatus)
        if (deliveryStatus) {
            await DeliveryStatus.deleteOne({ _id: order.deliveryStatus })
        }
        await Order.deleteOne({ _id: order._id })
    }
    return true
}