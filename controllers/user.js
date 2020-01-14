'use strict'
const userService = require('../services/user');
import { populateUserBooks, populateUsersBooks } from "../services/bookDetails.service";
const debug = require('debug')('app:userController');

module.exports = class userController {

    static async getById(req, res) {
        const user = await userService.getById(req.params.id);
        if (!user) {
            throw 'User not found!';
        }
        const userWithBooks = await populateUserBooks(user.toObject());
        res.json(userWithBooks);
    }

    static async getMe(req, res) {
        const user = await userService.getById(req.user._id);
        if (!user) {
            throw 'User not found!';
        }
        debug('check:',user.toObject());
        const userWithBooks = await populateUserBooks(user.toObject());
        res.json(userWithBooks);
    }

    static async getMany(req, res) {
        const users = await userService.getMany(req.user._id, req.query.startIndex);
        debug('getMany,users'+users)
        const usersWithBooks = await populateUsersBooks(
            users.map(
                u=>u.toObject()
                )
            );
        debug('getMany,usersWithBooks'+JSON.stringify(usersWithBooks))
        res.json(usersWithBooks);
    }
}
