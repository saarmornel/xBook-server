'use strict'
const userService = require('../services/user');
import { populateBook } from "../services/bookDetails.service";

// todo: validation of the book id
module.exports = class userBooksController {

    static async create(req, res) {
        const book = await userService.addBook(req.user._id, req.body);
        const bookWithData = await populateBook(book.toObject());
        res.json(bookWithData);
    }

    static async updateById(req, res) {
        const book = await userService.updateBookById(req.user._id, req.params.id, req.body);
        const bookWithData = await populateBook(book.toObject());
        res.json(bookWithData);
    }

    static async deleteById(req, res) {
        const book = await userService.deleteBookById(req.user._id, req.params.id);
        const bookWithData = await populateBook(book.toObject());
        res.json(bookWithData);
    }
    
}
