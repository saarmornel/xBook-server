'use strict';
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { isLoggedIn, notLoggedIn } = require('./loggedIn');
const userController = require('../controllers/user');

// =====================================================
// PROFILE SECTION FOR EVERY AUTH TYPE =====================
// =======================================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, async (req, res) => {
    res.json(req.user)
});
// =============================================================
// route for logging out =======================================
// ============================================================
router.get('/logout', isLoggedIn, (req, res) => {
    req.logout();
    res.json({message : 'Logged out succesfully'});
});


// ====================================================
// FACEBOOK AUTHENTICATION ROUTES =====================
// ==================================================
// route for facebook authentication and login
router.get('/auth/facebook', notLoggedIn, 
    passport.authenticate('facebook', { 
    scope : ['public_profile', 'email']
}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : 'https://auth.expo.io/@anonymous/xBook-04872410-8dd5-4024-b908-dd82385a31dc',
        failureRedirect : 'https://auth.expo.io/@anonymous/xBook-04872410-8dd5-4024-b908-dd82385a31dc'
}));

module.exports = router;
