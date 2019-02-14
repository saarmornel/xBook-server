'use strict';
const debug = require('debug')('app');
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn } = require('./loggedIn');
const userController = require('../controllers/user');
const client = require('../config/client');

router.get('/token', isLoggedIn, async (req, res) => {
    res.json(req.user)
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
        session: false
    }), (req, res) => {
        debug('callback called');
        let success = 'false';
        if (req.user.jwtoken) {
            success = 'true';
        } else {
            res.redirect(client.URL);
        }
        res.redirect(`${client.URL}#${req.user.jwtoken}`)
    }
);

module.exports = router;
