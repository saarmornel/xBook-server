const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;
import BookScheme from './UserBook';
const configAuth = require('../config/auth');

const userSchema = new Schema({
    facebook: {
        id: String,
        token: String,
        friends: [String]
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    given: { type: Number, default: 0 },
    recieved: { type: Number, default: 0 },
    books: [BookScheme],
    location: { type: String },
    phone: String,
    picture: String,
}, {
        timestamps: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

userSchema.virtual('balance').get(function () { return this.given - this.recieved });
userSchema.virtual('fullName').get(function () { return this.firstName + ' ' + this.lastName });

userSchema.methods.generateJwt = function () {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        exp: parseInt(exp.getTime() / 1000),
    }, configAuth.secret);
};

module.exports = mongoose.model('User', userSchema);
