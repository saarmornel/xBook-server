'use strict'
const userService = require('../services/user');
import { populateUserBooks, populateUsersBooks } from "../services/bookDetails.service";
const debug = require('debug')('userController');

module.exports = class userController {

    static async getById(req, res) {
        const user = await userService.getById(req.params.id);
        if (!user) {
            throw 'User not found!';
        }
        const userWithBooks = await populateUserBooks(user);
        res.json(userWithBooks);
    }

    static async getMe(req, res) {
        const user = await userService.getById(req.user._id);
        if (!user) {
            throw 'User not found!';
        }
        const userWithBooks = await populateUserBooks(user);
        res.json(userWithBooks);
    }

    static async getMany(req, res) {
        const users = await userService.getMany(req.user._id, req.query.startIndex);
        debug('getMany,users'+users)
        const usersWithBooks = await populateUsersBooks(users);
        debug('getMany,usersWithBooks'+JSON.stringify(usersWithBooks))
        res.json(usersWithBooks);
    }
}
