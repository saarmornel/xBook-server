'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const userController = require('../controllers/user');
import { wrapAsync } from '../utils/wrapper';

router.get('/', isLoggedIn, wrapAsync(userController.getMany));
router.get('/search', isLoggedIn, wrapAsync(userController.search));
router.get('/me/friends', isLoggedIn, wrapAsync(userController.getMyFriends));
router.put('/me/friends/:id', isLoggedIn, wrapAsync(userController.addFriend));
router.delete('/me/friends/:id', isLoggedIn, wrapAsync(userController.deleteFriend));
router.get('/me', isLoggedIn, wrapAsync(userController.getMe));
router.put('/me', isLoggedIn, wrapAsync(userController.updateMe));
router.get('/:id', isLoggedIn, wrapAsync(userController.getById));

module.exports = router;
