'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/success', (req, res) => {
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
        scope: ['public_profile', 'email', 'user_friends']
    }));

// handle the callback after facebook has authenticated the user
router.get('/facebook/callback',
    passport.authenticate('facebook', {
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/sign_in?auth_token=null`
    }), (req, res) => {
        debug('callback called');
        res.redirect(`${process.env.CLIENT_URL}/sign_in?auth_token=${req.user.jwtoken}`)
    }
);

module.exports = router;
