'use strict'
const userService = require('../services/user');
import { populateBook } from "../services/bookDetails.service";
import { isBookValid } from "../services/bookDetails.service";

// todo: validation of the book id
module.exports = class userBooksController {

    static async create(req, res) {
        if(!(await isBookValid(req.body.id)))
        throw new Error('invalid book id');
        const book = await userService.addBook(req.user._id, req.body);
        // const bookWithData = await populateBook(book);
        res.json(book);
    }

    static async updateById(req, res) {
        if(!(await isBookValid(req.body.id)))
        throw new Error('invalid book id');
        const book = await userService.updateBookById(req.user._id, req.params.id, req.body);
        // const bookWithData = await populateBook(book);
        res.json(book);
    }

    static async deleteById(req, res) {
        const book = await userService.deleteBookById(req.user._id, req.params.id);
        // const bookWithData = await populateBook(book);
        res.json(book);
    }
    
}