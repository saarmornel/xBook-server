const express = require('express');
const router = express.Router();

const user = require('./routes/user');
const auth = require('./routes/auth');
const request = require('./routes/request');

router.use('/user', user);
router.use('/request', request);
router.use('/auth', auth);

module.exports = router;
