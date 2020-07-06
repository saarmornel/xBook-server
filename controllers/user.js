'use strict'
const userService = require('../services/user');
import { populateUserBooks, populateBooks } from "../services/bookDetails.service";
const debug = require('debug')('app:userController');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = class userController {

    static async getById(req, res) {
        const user = await userService.getById(req.params.id);
        if (!user) {
            throw 'User not found!';
        }
        // const userWithBooks = await populateUserBooks(user.toObject());
        res.json(user);
    }

    static async getMe(req, res) {
        let user = await userService.getById(req.user._id);
        user = await user.populate('friends').execPopulate();
        if (!user) {
            throw 'User not found!';
        }
        
        //const userWithBooks = await populateUserBooks(user.toObject());
        res.json(user);
    }

    static async getMany(req, res) {
        const users = await userService.getMany(req.user._id,null, req.query.page);
        debug('getMany,users'+users)
        res.json(users);
    }

    static async search(req, res) {
        const users = await userService.search(req.query.q,req.user._id);
        debug('search,users'+users)
        res.json(users);
    }

    static async addFriend(req,res) {
        const user = await userService.getById(req.user._id);
        const friends = user.friends;
        const id = ObjectId(req.params.id);
        const index=friends.findIndex(f=>f.equals(id));
        if(index>-1) {
            throw 'You are already friends!'
        }
        friends.push(new ObjectId(id));
        user.save();
        res.json(user);
    }

    static async deleteFriend(req,res) {
        const user = await userService.getById(req.user._id);
        const friends = user.friends;
        const id = req.params.id;
        const index = friends.findIndex(f=>f.equals(id));
        if(index<0) {
            throw 'You are not friends!'
        }
        friends.splice(index,1);
        user.save();
        res.json(user);
    }

    static async updateMe(req,res) {
        const update = {phone: req.body.phone,location: req.body.location};
        const user = await userService.updateById(req.user._id,update)
        res.json(user);
    }
}
