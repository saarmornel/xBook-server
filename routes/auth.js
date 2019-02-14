'use strict';
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
        let success = 'false';
        if (req.user.jwtoken) {
            success = 'true';
        } else {
            res.redirect(401,client.URL);
        }
        res.redirect(200,`${client.URL};token=${req.user.jwtoken};success=${success}?token=${req.user.jwtoken}&success=${success}`)
    }
);

module.exports = router;
