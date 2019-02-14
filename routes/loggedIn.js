'use strict';

// route middleware to make sure a user is logged in
module.exports.isLoggedIn = function (req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    var err = new Error("You need to log in in order to procceed...");
    err.status = 401;       //401 means unauthorized
    return next(err);
}

module.exports.notLoggedIn = function (req, res, next) {

    if (req.isAuthenticated()) {

        var err = new Error("You are already logged in...");
        err.status = 401;       //401 means unauthorized
        return next(err);
    }
    return next();
}

