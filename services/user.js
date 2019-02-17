'use strict'
const User = require('../models/User');
const config = require('../config/query');

module.exports = class userService {
    //todo: remove facebook field
    static getById(id) {
        return User.findById(
            id,
        )
        .select('-facebook')
        .exec();
    }

    static getMany(
        startIndex = 0,
        endIndex = config.pagination.resultsPerPage,
        filter={'books.available': { $eq: true}},
        sortOrder = '-',
        sortBy = 'recieved',
    ) {
        return User
            .find(filter)
            .select('-facebook')
            .sort(sortOrder + sortBy)
            .skip(startIndex)
            .limit(endIndex - startIndex)
            .exec();
    }

    static async addBook(userId, book) {
        const userDoc = await User.findById(userId).exec();
        if(!userDoc) throw 'User not found!'

        userDoc.books.push(book);
        await userDoc.save();
        return book;
    }

    static async findBookById(userId,bookId) {
        const userDoc = await User.findById(userId).exec();
        if(!userDoc) throw 'User not found!'

        const bookDoc = userDoc.books.id(bookId);
        return bookDoc;
    }

    static async updateBookById(userId, bookId, book){
        const userDoc = await User.findById(userId).exec();
        if(!userDoc) throw 'User not found!'

        const bookDoc = userDoc.books.id(bookId);
        bookDoc.set(book);
        await userDoc.save();
        return bookDoc;
    }

    static async deleteBookById(userId, bookId){
        const userDoc = await User.findById(userId).exec();
        if(!userDoc) throw 'User not found!'
        
        userDoc.books.id(bookId).remove();
        await userDoc.save();
        return null;
    }

}

