'use strict';

module.exports.isLoggedIn = passport.authenticate('jwt', {session: false})
