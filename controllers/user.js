'use strict'
const userService = require('../services/user');

module.exports = class userController {

    static async getProfile(userId) {
        const detailedUser = await userService.getProfile(userId);
        return detailedUser;
    }

}
