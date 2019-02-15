const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BookScheme = new Schema({
    _id: {
        type: String,
        required: true,
    },
    available: {type: Boolean, default: false}, 
}, {
    timestamps: true,
    id: true,
    toJSON: {
        virtuals: true,
    },
    toObject: {
        virtuals: true,
    },
});

BookScheme.virtual('id').set(function (this, id) {
    this._id = id;
});


export default BookScheme;