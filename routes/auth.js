'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('./loggedIn');
const userController = require('../controllers/user');
const client = require('../config/client');

router.get('/token', isLoggedIn, (req, res) => {
    res.json(req.user)
});

router.get('/success', isLoggedIn, (req, res) => {
    res.json({success: true, auth_token: req.user })
});

router.get('/failed', (req, res) => {
    res.json({success: false})
});

// ====================================================
// FACEBOOK AUTHENTICATION ROUTES =====================
// ==================================================
// route for facebook authentication and login
router.get('/facebook',
    passport.authenticate('facebook', {
        scope: ['public_profile', 'email']
    }));

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        session: false,
        failureRedirect: '/api/auth/failed'
    }), (req, res) => {
        debug('callback called');
        res.redirect(`/api/auth/success?auth_token=${req.user.jwtoken}`)
    }
);

module.exports = router;
