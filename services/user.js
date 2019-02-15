'use strict'
const User = require('../models/User');
const config = require('../config/query');

module.exports = class userService {

    static getById(id) {
        return User.findById(
            id,
        ).exec();
    }

    static getMany(
        filter={},
        startIndex = 0,
        endIndex = config.pagination.resultsPerPage,
        sortOrder = '-',
        sortBy = 'recieved',
    ) {
        return User
            .find(filter)
            .sort(sortOrder + sortBy)
            //.skip(startIndex)
            //.limit(endIndex - startIndex)
            .exec();
    }

    static addBook(userId, book) {
        const userDoc = await User.findBy(userId).exec();
        userDoc.books.push(book);
        return await userDoc.save();
    }

    static updateBookById(userId, bookId, book){
        const userDoc = await User.findBy(userId).exec();
        const bookDoc = userDoc.books.id(bookId);
        bookDoc.set(book);
        return await userDoc.save();
    }

    static deleteBookById(userId, bookId){
        const userDoc = await User.findBy(userId).exec();
        userDoc.books.id(bookId).remove();
        return await userDoc.save();
    }

}

