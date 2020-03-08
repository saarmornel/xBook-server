const fetch = require("node-fetch");
const debug = require('debug')('app');
import * as mocks from "./google.mocks";
/*
    take only the needed info from api
*/
const cleanseBook = (book) => {
    const newBook={};
    newBook.id=book.id;
    newBook.title=book.volumeInfo.title;
    // newBook.thumbnail=book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.smallThumbnail
    newBook.thumbnail= `https://books.google.com/books/content?id=${book.id}&printsec=frontcover&img=1&zoom=1&h=160&stbn=1&key=${APIKey}`
    newBook.author=book.volumeInfo.authors && book.volumeInfo.authors.join(', ');
    newBook.more=book.volumeInfo.infoLink;
    return newBook;
}

export const searchBook = async (bookName) => {
    try {
        const maxResults = 4;
        let resJson;
        if(IS_MOCK) {
            resJson = mocks.googleBooks;
        }
        else {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(bookName)}&maxResults=${maxResults}&key=${APIKey}`);
            resJson = await res.json();
        }

        if(!resJson.totalItems) return [];
        const books = resJson.items;
        const formattedBooks = books.map(cleanseBook);
        return formattedBooks;
    } catch(error) {
        console.error('httpError: ',error);
        return []
    }

}

export const getBookById = async (id) => {
    try {
        let book;
        if(IS_MOCK) {
            book = mocks.googleBooks.items.find(e=>e.id === id);
        } 
        else {
            const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}?key=${APIKey}`);
            book = await res.json();
        }

        const formattedBook = cleanseBook(book);
        return formattedBook;
    } catch(error) {
        console.error('httpError: ',error);
        return null
    }
}

const IS_MOCK = process.env.ENV === 'development' ? true : false
const APIKey = process.env.GOOGLE_API_KEY;
debug('APIKey:'+APIKey)