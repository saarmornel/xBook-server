const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const configAuth = require('./auth');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const debug = require('debug')('app');
const unknownPicture = 'https://scontent.ftlv6-1.fna.fbcdn.net/v/t1.0-1/c47.0.160.160a/p160x160/10354686_10150004552801856_220367501106153455_n.jpg?_nc_cat=1&_nc_ht=scontent.ftlv6-1.fna&oh=fd6d547938a76cfe0bf7258c2ee3352b&oe=5CEAE91E';

module.exports = function (passport) {

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields,
    },
        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {
            debug('got token from facebook')
            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    debug('check if user exist')
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        user.picture = profile.photos ? profile.photos[0].value : '';
                        user.facebook.friends = profile.friends && profile.friends.data.map(friend => friend.id);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            user.jwtoken = user.generateJwt();
                            return done(null, user);
                        });
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        const newUser = new User();
                        debug('newUser init:',newUser)
                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.firstName = profile.name.givenName;
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        newUser.facebook.friends = profile.friends && profile.friends.data.map(friend => friend.id);
                        user.picture = profile.photos ? profile.photos[0].value : unknownPicture;
                        debug('newUser-before-save:',newUser)
                        newUser.save(function (err) {
                            if (err)
                                return done(err);
                            newUser.jwtoken = newUser.generateJwt();
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

    // =========================================================================
    // JWT EXTRACTION ================================================================
    // =========================================================================
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: configAuth.secret
    },
        function (jwtPayload, cb) {
            debug('extract jwt')
            return cb(null, jwtPayload);
        }
    ));
};
