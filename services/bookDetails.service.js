import * as googleBooks from './googleBooks.serivce';
const debug = require('debug')('app:bookDetails');

export const getBook = (id) => {
    return googleBooks.getBookById(id);
}

export const isBookValid = async (id) => {
    const book = await googleBooks.getBookById(id);
    return book ? true : false;
}

export const searchBook = (bookName) => {
    return googleBooks.searchBook(bookName);
}

export const populateBook = async (book) => {
    const data = await getBook(book.id);
    return {...book, data };
}

export const populateBooks = async (books) => {
    return Promise.all(books.map(populateBook) );
}

export const populateUserBooks = async (user) => {
    const books = (await Promise.all(user.books.map(populateBook) )).filter(Boolean);
    debug('populateUserBooks',books)
    return {...user, books};
}

export const populateUsersBooks = async (users) => {
    const newUsers = await Promise.all(users.map( populateUserBooks ));
    return newUsers;
}

export const populateRequest = async (request) => {
    const data = await getBook(request.book);
    return {...request, data};
}

export const populateRequests = async (requests) => {
    return await Promise.all(
        requests.map(populateRequest)
    );
}