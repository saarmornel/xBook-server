'use strict'
const userService = require('../services/user');
import { populateUserBooks, populateBooks } from "../services/bookDetails.service";
const debug = require('debug')('app:userController');

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
        const user = await userService.getById(req.user._id);
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
        const users = await userService.search(req.query.q,req.user._id,req.user.facebook.friends);
        debug('search,users'+users)
        res.json(users);
    }

    static async getMyFriends(req, res) {
        const users = await userService.getMany(req.user._id,req.user.facebook.friends , req.query.page);
        debug('getMyFriends,users'+users)
        res.json(users);
    }

    static async updateMe(req,res) {
        const user = await userService.updateById(req.user._id,req.body)
        res.json(user);
    }
}
