'use strict'
const requestService = require('../services/request');
const userService = require('../services/user');
import { REQUEST_STATUS } from '../models/Request.Status';

const canUpdate = (user,request, proposedStatus) => {
    let canDo = [];
    canDo = request.requesting == user && [REQUEST_STATUS.pending, REQUEST_STATUS.accepted];
    canDo = request.receiving == user && [REQUEST_STATUS.approved, REQUEST_STATUS.declined];
    return !!canDo.find(status => proposedStatus == status);
}

const canDelete = (user,request) => !(request.requesting == user);

const isOwner = (user,request) => !(request.requesting == user || request.receiving == user);

module.exports = class requestController {

    static async getById(req, res) {
        const request = await userService.getById(req.params.id);
        if (!request) {
            throw 'User not found!';
        }
        const user = req.user._id;
        if(isOwner(user,request)) {
            throw 'Request does not belong to you!';
        }

        res.json(request);
    }

    static async getReceiving(req, res) {
        res.json(await VideoManager.getReceiving(req.user._id));
    }

    static async getRequesting(req, res) {
        res.json(await VideoManager.getRequesting(req.user._id));
    }

    static async create(req, res) {
        res.json(await requestService.create({requesting: req.user._id, ...req.body}));
    }

    static async updateById(req, res) {
        const request = await userService.getById(req.params.id);
        if (!request) {
            throw 'User not found!';
        }
        const user = req.user._id;
        if(!canUpdate(user,request,req.body.status)) throw 'lack permissions';

        if(req.body.status == REQUEST_STATUS.accepted) {
            await userService.addBook(request.requesting, request.book);
            await userService.deleteBookById(request.receiving, request.book);
        }
        res.json(await requestService.updateById(req.params.id, req.body));
    }

    static async deleteById(req, res) {
        const request = await userService.getById(req.params.id);
        if (!request) {
            throw 'User not found!';
        }
        const user = req.user._id;
        if(canDelete(user,request)) {
            throw 'Request does not belong to you!';
        }
        res.json(await requestService.deleteById(req.params.id));
    }
    
}
