'use strict'
const requestService = require('../services/request');
const userService = require('../services/user');
import { REQUEST_STATUS } from '../models/Request.Status';
import { populateRequest, populateRequests } from "../services/bookDetails.service";
const debug = require('debug')('app:requestController')

//todo: fix issue here
const canUpdate = (user,request, proposedStatus) => {
    let canDo = [];
    debug('canUpdate,request.requesting',request.requesting)
    debug('canUpdate,request.receiving',request.receiving)
    debug('canUpdate,user',user)
    canDo = (request.requesting.toString() == user) && [REQUEST_STATUS.pending, REQUEST_STATUS.accepted,REQUEST_STATUS.declined];
    canDo = (request.receiving.toString() == user) && [REQUEST_STATUS.approved, REQUEST_STATUS.declined];
    debug('canDo',canDo)
    return !!(canDo && canDo.find(status => proposedStatus == status));
}

const canDelete = (user,request) => !(request.requesting == user);

const isOwner = (user,request) => !(request.requesting == user || request.receiving == user);

module.exports = class requestController {

    static async getById(req, res) {
        const request = await requestService.getById(req.params.id);
        if (!request) {
            throw 'Request not found!';
        }
        const user = req.user._id;
        if(isOwner(user,request)) {
            throw 'Request does not belong to you!';
        }
        const requestWithData = await populateRequest(request.toObject());
        res.json(requestWithData);
    }

    static async getIncoming(req, res) {
        const incoming = await requestService.getIncoming(req.user._id)
        const incomingWithData = await populateRequests(incoming.map(r=>r.toObject()))
        res.json(incomingWithData);
    }

    static async getOutgoing(req, res) {
        const outgoing = await requestService.getOutgoing(req.user._id)
        const outgoingWithData = await populateRequests(outgoing.map(r=>r.toObject()))
        res.json(outgoingWithData);
    }

    static async create(req, res) {
        const bookDoc = await userService.findBookById(req.body.receiving, req.body.book);
        if(!bookDoc) throw 'book does not exist';
        
        const response = await requestService.create({...req.body, requesting: req.user._id})
        .then(r=>populateRequest(r.toObject()))
        res.json(response);
    }

    static async updateById(req, res) {
        const request = await requestService.getById(req.params.id);
        if (!request) {
            throw 'Request not found!';
        }
        const user = req.user._id;
        if(!canUpdate(user,request,req.body.status)) throw 'lack permissions';

        if(req.body.status == REQUEST_STATUS.accepted) {
            await userService.addBook(request.requesting, request.book);
            await userService.deleteBookById(request.receiving, request.book);
            await userService.updateRating(request.requesting,request.receiving);
        }
        const response = await requestService.updateById(req.params.id, req.body)
        // .then(r=>{populateRequest(r.toObject())})
        res.json(response);
    }

    static async deleteById(req, res) {
        const request = await requestService.getById(req.params.id);
        if (!request) {
            throw 'Request not found!';
        }
        const user = req.user._id;
        if(canDelete(user,request)) {
            throw 'Request does not belong to you!';
        }

        const response = await requestService.deleteById(req.params.id)
        // .then(r=>populateRequest(r.toObject()))
        res.json(response);
    }
    
}
