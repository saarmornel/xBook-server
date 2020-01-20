'use strict'
const User = require('../models/User');
const config = require('../config/query');
var Elo = require( 'elo-js' );

module.exports = class userService {
    
    /*
        in a user view: should show all books
    */
    static getById(id) {
        return User.findById(
            id,
        )
        .select('-facebook')
        .exec();
    }

    /*
        in a global view: should show only available books
    */
    static getMany(
        excludeId = null,
        includeIDs = [],
        page = 0,
        sortOrder = '-',
        sortBy = 'received',
    ) {
        const filter = {'books.available': { $eq: true}, '_id': { $ne: excludeId }, 'facebook.id': {$in: includeIDs}};
        const perPage = config.pagination.resultsPerPage;
        return User
            .find(filter)
            .select('-facebook')
            .sort(sortOrder + sortBy)
            .skip(perPage * page)
            .limit(perPage)
            .exec();
    }

    static async addBook(userId, book) {
        const userDoc = await User.findById(userId).exec();
        if(!userDoc) throw 'User not found!'
        if(userDoc.books.id(book)) throw 'You already have the book!';
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

    static async updateRating(requesting, receiving) {
        const elo = new Elo();
        const starsCount = 5;
        
        const requestingDoc = await User.findById(requesting).exec();
        if(!requestingDoc) throw 'User not found!';
        requestingDoc.received++;


        const receivingDoc = await User.findById(receiving).exec();
        if(!receivingDoc) throw 'User not found!';
        receivingDoc.given++;

        const requestingRating = requestingDoc.rating;
        const receivingRating = receivingDoc.rating;

        requestingDoc.rating = elo.ifLoses(requestingRating,receivingRating)
        receivingDoc.rating = elo.ifWins(receivingRating,requestingRating);

        const highestRanking = (await User.find().sort({rating: -1}).limit(1).exec())[0].rating;
        let starRating;
        if(receivingDoc.rating > highestRanking) {
            starRating = receivingDoc.rating / starsCount;
        } else {
            starRating = highestRanking / starsCount;
        }

        requestingDoc.stars = Math.floor(requestingDoc.rating/starRating);
        receivingDoc.stars = Math.floor(receivingDoc.rating/starRating);

        await receivingDoc.save();
        await requestingDoc.save();
    }

    static updateById(id, user){
        return User.updateOne({_id:id},user).exec();
    }

}

