'use strict'
const Request = require('../models/Request');
const User = require('../models/User');
const config = require('../config/query');
const debug = require('debug')('app:requestService');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class requestService {

    static getById(id) {
        return Request.findById(
            id,
        ).exec();
    }

    static async getOutgoing(userId) {
        const requests = 
        await Request
        .aggregate([
        {'$match': {requesting: new ObjectId(userId)}},
        {$project: {
            read:"$read.requesting",
            id: "$_id",
            book: 1,
            user: "$receiving",
            status: 1,
            updatedAt: 1,
            createdAt: 1
            }}
        ])
        .sort('-updatedAt');
        
        await User.populate(requests,{path:'user', select: {
            id: 1,
            fullName: 1,
            email: 1,
            phone: 1,
            stars: 1,
            picture: 1,
            firstName: 1,
            lastName: 1,
        }});
        
        return requests;
    }

    static async getIncoming(userId) {
        const requests = 
        await Request
        .aggregate([
        {'$match': {receiving: new ObjectId(userId)}},
        {$project: {
            read:"$read.receiving",
            id: "$_id",
            book: 1,
            user: "$requesting",
            status: 1,
            updatedAt: 1,
            createdAt: 1
            }}
        ])
        .sort('-updatedAt');
        
        await User.populate(requests,{path:'user', select: {
            id: 1,
            fullName: 1,
            email: 1,
            phone: 1,
            stars: 1,
            picture: 1,
            firstName: 1,
            lastName: 1,
        } } );
        
        return requests;
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

