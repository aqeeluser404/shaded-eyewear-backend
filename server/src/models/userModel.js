const mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
            }
        },

        // <-----------------------------------------------------------> FKID FIELD
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

userSchema.methods.updateLoginStatus = function() {
    this.loginInfo.lastLogin = Date.now()
    this.loginInfo.isLoggedIn = true
    this.loginInfo.loginCount += 1
    this.save()
}

userSchema.methods.logout = function() {
    this.loginInfo.isLoggedIn = false;
    this.save();
}

module.exports = mongoose.model('User', userSchema);