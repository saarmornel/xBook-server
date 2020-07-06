'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const requestController = require('../controllers/request');
import { wrapAsync } from '../utils/wrapper';

router.get('/incoming',isLoggedIn, wrapAsync(requestController.getIncoming));
router.get('/outgoing',isLoggedIn, wrapAsync(requestController.getOutgoing));
router.get('/:id',isLoggedIn, wrapAsync(requestController.getById));
router.post('/', isLoggedIn, wrapAsync(requestController.create));
router.patch('/:id', isLoggedIn, wrapAsync(requestController.updateStatus));
router.patch('/:id/read', isLoggedIn, wrapAsync(requestController.setRead));
router.delete('/:id', isLoggedIn, wrapAsync(requestController.deleteById));

module.exports = router;
