'use strict'
const userService = require('../services/user');

module.exports = class userBooksController {

    static async create(req, res) {
        res.json(await userService.addBook(req.user._id, req.body));
    }

    static async updateById(req, res) {
        res.json(await userService.updateBookById(req.user._id, req.params.id, req.body));
    }

    static async deleteById(req, res) {
        res.json(await userService.deleteBookById(req.user._id, req.params.id));
    }
    
}
