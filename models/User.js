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
    received: { type: Number, default: 0 },
    rating: { type: Number, default: 3000 },
    stars: { type: Number, default: 3 },
    books: [BookScheme],
    location: { type: String },
    phone: String,
    picture: String,
}, {
        usePushEach: true,
        timestamps: true,
        id: true,
        toObject: {
            virtuals: true
        },
        toJSON: {
            virtuals: true
        }
    });

userSchema.virtual('fullName').get(function () { return this.firstName + ' ' + this.lastName });

userSchema.methods.generateJwt = function () {
    const daysExpired = 1;

    const today = new Date();
    let exp = new Date(today);
    exp.setDate(today.getDate() + daysExpired);

    return jwt.sign({
        _id: this._id,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        facebook: {
            id: this.facebook.id,
            friends: this.facebook.friends
        },
        // exp: parseInt(exp.getTime() / 1000),
    }, configAuth.secret);
};

module.exports = mongoose.model('User', userSchema);
