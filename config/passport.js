const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');
const configAuth = require('./auth');
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const debug = require('debug')('app');
const unknownPicture = 'https://scontent.ftlv6-1.fna.fbcdn.net/v/t1.0-1/c47.0.160.160a/p160x160/10354686_10150004552801856_220367501106153455_n.jpg?_nc_cat=1&_nc_ht=scontent.ftlv6-1.fna&oh=fd6d547938a76cfe0bf7258c2ee3352b&oe=5CEAE91E';

module.exports = function (passport) {

    // FACEBOOK ================================================================
    passport.use(new FacebookStrategy({
        clientID: configAuth.facebookAuth.clientID,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackURL,
        profileFields: configAuth.facebookAuth.profileFields,
    },
        function (token, refreshToken, profile, done) {
            debug('got token from facebook')
            // asynchronous
            process.nextTick(function () {
                User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                    debug('check if user exist')
                    if (err)
                        return done(err);
                    if (user) {
                        user.picture = profile.photos ? profile.photos[0].value : unknownPicture;
                        user.facebook.friends = 
                        profile._json.friends &&
                        profile._json.friends.data.map(friend => friend.id);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            user.jwtoken = user.generateJwt();
                            return done(null, user);
                        });
                    } else {
                        const newUser = new User();
                        newUser.facebook.id = profile.id;                
                        newUser.facebook.token = token; 
                        newUser.lastName = profile.name.familyName; 
                        newUser.firstName = profile.name.givenName;
                        newUser.email = profile.emails[0].value; 
                        newUser.facebook.friends = 
                        profile._json.friends &&
                        profile._json.friends.data.map(friend => friend.id);
                        newUser.picture = profile.photos ? profile.photos[0].value : unknownPicture;
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

    // JWT EXTRACTION ================================================================
    passport.use(new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderWithScheme('Bearer'),
        secretOrKey: configAuth.secret
    },
        function (jwtPayload, cb) {
            return cb(null, jwtPayload);
        }
    ));
};


/* facebook profile structure:
accessToken:  _______
refreshToken:  undefined
profile:  { id: '_______',
  username: undefined,
  displayName: '_______',
  name: 
   { familyName: '_______',
     givenName: '_______',
     middleName: '_______' },
  gender: '_______',
  profileUrl: 'https://www.facebook.com/app_scoped_user_id/_______/',
  emails: [ { value: '_______@_______.com' } ],
  photos: [ { value: 'https://scontent.xx.fbcdn.net/_______' } ],
  provider: 'facebook',
  _raw: '{"id":"_______","name":"_______","picture":{"data":{"height":200,"is_silhouette":false,"url":"https:\\/\\/scontent.xx.fbcdn.net\_______","width":200}},"first_name":"_______ _______","last_name":"_______","gender":"_______","link":"https:\\/\\/www.facebook.com\\/app_scoped_user_id\\/_______\\/","email":"_______.com","location":{"id":"_______","name":"_______"},"friends":{"data":[],"summary":{"total_count":_______}}}',
  _json: 
   { id: '_______',
     name: '_______',
     picture: { data: [Object] },
     first_name: '_______',
     last_name: '_______',
     gender: '_______',
     link: 'https://www.facebook.com/app_scoped_user_id/_______/',
     email: '_______@_______.com',
     location: { id: '_______', name: '_______' },
     friends: { data: [], summary: [Object] } } }

*/