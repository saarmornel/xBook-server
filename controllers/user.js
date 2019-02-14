'use strict'
const userService = require('../services/user');

module.exports = class userController {

    static async getProfile(user) {
        const detailedUser = await userService.getProfile(user._id);
        return detailedUser;
    }

}
