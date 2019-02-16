module.exports = {
    'secret'  : 'SECRET',
    'facebookAuth' : {
        'clientID'      : '394487584338989', // your App ID
        'clientSecret'  : 'ad9bd92277858b2a1f26ed275fb49738', // your App Secret
        'callbackURL'   : 'https://glacial-fortress-14735.herokuapp.com/api/auth/facebook/callback',
        'profileURL'    : 'https://graph.facebook.com/v2.5/me?fields=first_name,last_name,email',
        'profileFields' : ['id', 'email', 'name','friends','photos'] // For requesting permissions from Facebook API
    },
};
