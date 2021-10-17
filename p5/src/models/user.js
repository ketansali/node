const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require('bcrypt')

const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'first Name Is required'],
        minlength: 3
    },
    lastName: {
        type: String,
        required: [true, 'last Name Is required'],
        minlength: 3
    },
    email: {
        type: String,
        required: [true, 'email Is required'],
        unique: [true, 'Email id Already Present'],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new error("Invalid Email")
            }
        }
    },
    contact: {
        type: String,
        required: [true, 'Contact Is required'],
        minlength: 10,
        maxlength: 10
    },
    hash_password: {
        type: String,
        required: [true, 'Password Is required'],
        minlength: 3
    },
    isVerified: {
        type: String,
        default: 0
    }

})
UserSchema.virtual('password')
    .set(function(password) {
        this.hash_password = bcrypt.hashSync(password, 10)
    })
module.exports = mongoose.model('User', UserSchema)