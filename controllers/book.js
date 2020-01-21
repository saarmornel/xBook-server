'use strict'
import { searchBook, populateBooks } from "../services/bookDetails.service";
const userService = require('../services/user');
import { isBookValid } from "../services/bookDetails.service";
import { REQUEST_STATUS } from "../models/Request.Status";
const requestService = require('../services/request');
const debug = require('debug')('app:bookController');

module.exports = class bookController {

    static async search(req, res) {
        const q = req.query.q;
        const books = q ? searchBook(q) : [];
        res.json(await books);
    }

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

    static async getBooks(req, res) {
        const outgoings = await requestService.getOutgoing(req.user._id);
        const excludeBooks = outgoings.filter(o=>o.status!==REQUEST_STATUS.declined).map(o => o.book);

        const books = await userService.getBooks(req.user._id, req.user.facebook.friends,excludeBooks,req.query.page);
        debug(books)
        const booksWithData = await populateBooks(
            books
            );
        debug('booksWithData'+JSON.stringify(booksWithData))
        res.json(booksWithData);
    }

    static async getMyBooks(req, res) {
        const books = await userService.getBooksByUser(req.user._id);

        const booksWithData = await populateBooks(
            books
            // .map(
            //     b=>b.toObject()
            //     )
            );

        res.json(booksWithData);
    }
}
