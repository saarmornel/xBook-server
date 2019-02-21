const mongoose = require('mongoose');
const Schema = mongoose.Schema;
import { REQUEST_STATUS } from './Request.Status';

const requestSchema = new Schema({
    requesting : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiving : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book : { type: String, required: true },
    status: {type: String, default: REQUEST_STATUS.pending, enum: [Object.values(REQUEST_STATUS)]},
    read: { 
        requesting: {type: Boolean, default: true},
        receiving: {type: Boolean, default: false},
     }
}, {
    timestamps: true,
    id: true
});

module.exports = mongoose.model('Request', requestSchema);
