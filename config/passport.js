const FacebookStrategy = require('passport-facebook').Strategy;
// load up the user model
const User = require('../models/User');
// load the auth variables
const configAuth = require('./auth');
//jwt
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

module.exports = function (passport) {

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({
        // pull in our app id and secret from our auth.js file
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields,
    },

        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {

            // asynchronous
            process.nextTick(function () {

                // find the user in the database based on their facebook id
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {

                    // if there is an error, stop everything and return that
                    // ie an error connecting to the database
                    if (err)
                        return done(err);

                    // if the user is found, then log them in
                    if (user) {
                        user.jwtoken = newUser.generateJwt(); // JWT CREATION!
                        return done(null, user); // user found, return that user
                    } else {
                        // if there is no user found with that facebook id, create them
                        const newUser = new User();
                        // set all of the facebook information in our user model
                        newUser.facebook.id = profile.id; // set the users facebook id                   
                        newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
                        newUser.lastName = profile.name.familyName; // look at the passport user profile to see how names are returned
                        newUser.firstName = profile.name.givenName;
                        newUser.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
                        // save our user to the database
                        newUser.save(function (err) {
                            if (err)
                                throw err;

                            newUser.jwtoken = newUser.generateJwt(); // JWT CREATION!
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
        secretOrKey: 'SECRET'
    },
        function (jwtPayload, cb) {
            return cb(null, jwtPayload);
            // //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
            // return UserModel.findOneById(jwtPayload.id)
            //     .then(user => {
            //         return cb(null, user);
            //     })
            //     .catch(err => {
            //         return cb(err);
            //     });
        }
    ));
};
