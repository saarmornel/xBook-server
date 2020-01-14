'use strict'
import { searchBook } from "../services/bookDetails.service";

module.exports = class bookController {

    static async getMany(req, res) {
        const q = req.query.q;
        const books = q ? searchBook(q) : [];
        res.json(await books);
    }
}
