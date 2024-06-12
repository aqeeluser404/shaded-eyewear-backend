const User = require('../models/userModel')
const Order = require('../models/orderModel')
const OrderType = require('../models/orderTypeModel')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// const crypto = require('crypto')
// const nodemailer = require('nodemailer')

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

// <-----------------------------------------------------------> AUTHENTICATION
module.exports.UserRegisterService = async (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingUser = await User.findOne({ username: userDetails.username });
            if (existingUser) {
                return reject('Username already exists');
            }
            const userModelData = new User();
            const userType = process.env.CREATE_ADMIN === 'true' ? 'admin' : 'user'; 
            const hashedPassword = await bcrypt.hash(userDetails.password, 10);

            userModelData.firstName = userDetails.firstName;
            userModelData.lastName = userDetails.lastName;
            userModelData.email = userDetails.email;
            userModelData.phone = userDetails.phone;
            userModelData.username = userDetails.username;
            userModelData.password = hashedPassword;
            userModelData.userType = userType;  // defaults to user
            userModelData.dateCreated = new Date();
            // order and location creates default fields

            userModelData.save()
                .then((result) => {
                    resolve(true);
                })
                .catch((error) => {
                    reject(false);
                });
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.UserLoginService = async (username, email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Search for a user with either the provided username or email
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
            
            const token = jwt.sign({ _id: user._id, userType: user.userType }, jwtSecret);
            resolve(token)
        } catch (error) {
            reject(error)
        }
    });
}
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
// <-----------------------------------------------------------> USER SERVICES
module.exports.FindUserByIdService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(id)
            if (!user) {
                throw new Error('User not found')
            }
            resolve(user)
        }
        catch (error) {
            reject (error)
        }
    })
}
module.exports.FindUserByTokenService = async (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.findById(decoded._id)
            if (!user) {
                throw new Error('User not found')
            }
            resolve(user)
        }
        catch (error) {
            reject (error)
        }
    })
}
module.exports.CreateUserService = async (userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            const existingUser = await User.findOne({ username: userDetails.username });
            if (existingUser) {
                return reject('Username already exists');
            }

            const userModelData = new User();
            const hashedPassword = await bcrypt.hash(userDetails.password, 10);

            userModelData.firstName = userDetails.firstName;
            userModelData.lastName = userDetails.lastName;
            userModelData.email = userDetails.email;
            userModelData.phone = userDetails.phone;
            userModelData.username = userDetails.username;
            userModelData.password = hashedPassword;
            userModelData.userType = userDetails.userType; // specified by admin
            userModelData.dateCreated = new Date();
            // order and location creates default fields

            userModelData.save()
                .then((result) => {
                    resolve(true);
                })
                .catch((error) => {
                    reject(error);
                });
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.FindAllUsersService = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await User.find({})
            if (!users) {
                throw new Error('No users found')
            }
            resolve(users)
        }
        catch (error) {
            reject (error)
        }
    })
}
module.exports.UpdateUserService = async (id, userDetails) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (userDetails.password) {
                userDetails.password = await bcrypt.hash(userDetails.password, 10);
            }
            const user = await User.findByIdAndUpdate(id, userDetails, { new: true });
            if (!user) {
                throw new Error('User not found');
            }
            resolve(user);
        } catch (error) {
            reject(error);
        }
    });
}
module.exports.DeleteUserService = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}