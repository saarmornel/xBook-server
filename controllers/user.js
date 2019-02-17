'use strict'
const userService = require('../services/user');

module.exports = class userController {

    static async getById(req, res) {
        const user = await userService.getById(req.params.id);
        if (!user) {
            throw 'User not found!';
        }

        res.json(user);
    }

    static async getMe(req, res) {
        const user = await userService.getById(req.user._id);
        if (!user) {
            throw 'User not found!';
        }

        res.json(user);
    }

    static async getMany(req, res) {
        res.json(await userService.getMany(req.user._id, req.query.startIndex));
    }
}
