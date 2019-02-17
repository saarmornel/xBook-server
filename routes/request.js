'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('./loggedIn');
const requestController = require('../controllers/request');
import { wrapAsync } from '../utils/wrapper';

router.get('/',isLoggedIn, wrapAsync(requestController.getMany));
router.get('/:id',isLoggedIn, wrapAsync(requestController.getById));
router.post('/', isLoggedIn, wrapAsync(requestController.create));
router.put('/:id', isLoggedIn, wrapAsync(requestController.updateById));
router.delete('/:id', isLoggedIn, wrapAsync(requestController.deleteById));

module.exports = router;
