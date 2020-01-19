const express = require('express');
const router = express.Router();

const user = require('./routes/user');
const auth = require('./routes/auth');
const request = require('./routes/request');
const book = require('./routes/book')

router.use('/user', user);
router.use('/request', request);
router.use('/auth', auth);
router.use('/book', book);

module.exports = router;
