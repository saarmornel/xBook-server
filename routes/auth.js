'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const configAuth = require('../config/auth');

// ====================================================
// FACEBOOK AUTHENTICATION ROUTES =====================
// ==================================================
// route for facebook authentication and login
router.get('/facebook',
    passport.authenticate('facebook', {
        scope: configAuth.facebookAuth.scope
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
