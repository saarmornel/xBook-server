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
        const users = await userService.getMany(req.user._id, req.query.page);
        debug('getMany,users'+users)
        res.json(users);
    }
}
