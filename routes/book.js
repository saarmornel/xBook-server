'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const bookController = require('../controllers/book');
import { wrapAsync } from '../utils/wrapper';

router.get('/', isLoggedIn, wrapAsync(bookController.getMany));

module.exports = router;
