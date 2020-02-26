'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const userController = require('../controllers/user');
import { wrapAsync } from '../utils/wrapper';

router.get('/', isLoggedIn, wrapAsync(userController.getMany));
router.get('/me', isLoggedIn, wrapAsync(userController.getMe));
router.get('/:id', isLoggedIn, wrapAsync(userController.getById));

module.exports = router;
