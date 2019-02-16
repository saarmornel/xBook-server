'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const userController = require('../controllers/user');
import { wrapAsync } from '../utils/wrapper';
const userBooksController = require('../controllers/userBooks');

router.get('/', isLoggedIn, wrapAsync(userController.getMany));
router.get('/me', isLoggedIn, wrapAsync(userController.getMe));
router.get('/:id', isLoggedIn, wrapAsync(userController.getById));

router.post('/books', isLoggedIn, wrapAsync(userBooksController.create));
router.put('/books/:id', isLoggedIn, wrapAsync(userBooksController.updateById));
router.delete('/books/:id', isLoggedIn, wrapAsync(userBooksController.deleteById));


module.exports = router;
