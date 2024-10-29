const mongoose = require('mongoose')
var Schema = mongoose.Schema

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },   
        phone: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            enum: ['admin', 'user'],
            required: true
        },
        dateCreated: {
            type: Date,
            default: Date.now
        },

        verification: {
            isVerified: {
                type: Boolean,
                default: false
            },
            verificationToken: String,
            verificationTokenExpires: Date
        },

        // LOCATION DATA
        location: {
            streetAddress: {
                type: String,
                default: 'Not provided'
            },
            suburb: {
                type: String,
                default: 'Not provided'
            },
            city: {
                type: String,
                default: 'Not provided'
            },
            province: {
                type: String,
                default: 'Not provided'
            },
            postalCode: {
                type: Number,
                default: 0
            }
        },     

        forgotPassword: {
            resetPasswordToken: String,
            resetPasswordExpires: Date
        },

        // LOGIN DATA & HISTORY
        loginInfo: {
            lastLogin: {
                type: Date,
                default: null
            },
            isLoggedIn: {
                type: Boolean,
                default: false
            },
            loginCount: {
                type: Number,
                default: 0
            },
            loginToken: String
        },

        // Fk fields
        order: [{
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }]
    }, { collection: 'User' }
)

userSchema.methods.toJSON = function() {
    var obj = this.toObject();
    delete obj.password;
    return obj;
}

userSchema.methods.updateLoginStatus = function(token) {
    this.loginInfo.lastLogin = Date.now()
    this.loginInfo.isLoggedIn = true
    this.loginInfo.loginCount += 1
    this.loginInfo.loginToken = token
    return this.save()
}

userSchema.methods.logout = function() {
    this.loginInfo.isLoggedIn = false;
    this.save();
}

module.exports = mongoose.model('User', userSchema)