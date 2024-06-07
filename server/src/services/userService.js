const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

// USER AUTHENTICATION SERVICES
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
            // location not included in initial registration
            userModelData.phone = userDetails.phone;
            userModelData.username = userDetails.username;
            userModelData.password = hashedPassword;
            userModelData.userType = userType;
            userModelData.dateCreated = new Date();

            // userModelData.order.push(userDetails.orderId); 

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

// READ USERS (VERIFY AUTHORIY)
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

// ADMIN USER SERVICES
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
            // location not included in initial registration
            userModelData.username = userDetails.username;
            userModelData.password = hashedPassword;
            userModelData.userType = userDetails.userType;
            userModelData.dateCreated = new Date();

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
            resolve(true);
        } catch (error) {
            reject(error);
        }
    });
}