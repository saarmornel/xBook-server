const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const Schema = mongoose.Schema;

const BOOK_STATUS = {
    giveAway: 'GIVE_AWAY',
    reading: 'READING'
}

const BookScheme = new Schema({ 
    bookId: {type: String, required: true}, 
    status: {type: String, required: true, enum: [Object.values(BOOK_STATUS)]}, 
})

const userSchema = new Schema({
    facebook         : {
        id           : String,
        token        : String,
    },
    // TODO:support in google auth
    // google           : {
    //     id           : String,
    //     token        : String,
    // },
    firstName        : { type: String },
    lastName         : { type: String },
    email            : { type: String },
    given            : { type: Number },
    recieved         : { type: Number },
    books            : [BookScheme]
    // location         : { type: String },
    // phone            : String,
}, {
    //usePushEach: true
    timestamps: true,
});


userSchema.methods.generateJwt = function() {
    // set expiration to 60 days
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);
  
    return jwt.sign({
      _id: this._id,
      firstName: this.firstName,
      lastName: this.lastName,
      exp: parseInt(exp.getTime() / 1000),
    }, 'SECRET');
};

module.exports = mongoose.model('User', userSchema);
