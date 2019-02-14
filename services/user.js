'use strict'
const User = require('../models/User');
const CONFIG = require('../config/userInfo');

module.exports = class userService {

    //@param id - id of the public user
    static getPublicProfile(id) {       
        return User.findById(id).
        select(CONFIG.publicInfo).
        exec();
    }

    //@param id - id of the friend
    static getFriendProfile(id) {       
        return User.findById(id).
        select(CONFIG.friendInfo).
        exec();
    }

}

