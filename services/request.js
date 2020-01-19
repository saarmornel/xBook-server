'use strict'
const Request = require('../models/Request');
const config = require('../config/query');

module.exports = class requestService {

    static getById(id) {
        return Request.findById(
            id,
        ).exec();
    }

    static getOutgoing(userId) {
        return Request
            .find({requesting: userId})
            .populate('receiving')
            .sort('-updatedAt')
            .exec();
    }

    static getIncoming(userId) {
        return Request
            .find({receiving: userId})
            .populate('requesting')
            .sort('-updatedAt')
            .exec();
    }

    static create(request) {
        delete request.status;
        return Request.create(request);
    }

    static updateById(id, request){
        delete request.requesting;
        delete request.receiving;
        return Request.updateOne({_id:id},request).exec();
    }

    static deleteById(id){
        return Request.deleteOne({_id:id}).exec();
    }

}

