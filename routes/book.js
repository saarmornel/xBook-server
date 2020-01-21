'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const bookController = require('../controllers/book');
import { wrapAsync } from '../utils/wrapper';

router.get('/search', isLoggedIn, wrapAsync(bookController.search));
router.get('/', isLoggedIn, wrapAsync(bookController.getBooks));
router.get('/me', isLoggedIn, wrapAsync(bookController.getMyBooks));
router.post('/', isLoggedIn, wrapAsync(bookController.create));
router.put('/:id', isLoggedIn, wrapAsync(bookController.updateById));
router.delete('/:id', isLoggedIn, wrapAsync(bookController.deleteById));

module.exports = router;
