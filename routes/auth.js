const Router = require("express").Router;
const router = new Router();
const ExpressError = require("../expressError") ;
const user = require("../models/user");
const {SECRET_KEY} = require("../config");
const jwt = require("jsonwebtoken");


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */ 
router.post("/register", async function (req, res, next) {
    try {
        let { username } = await user.register(req.body);  
        //return token
        let token = jwt.sign({username}, SECRET_KEY);
        console.log(`Token = ${token}`);

        //TODO:
        //User.updateLoginTimestamp(username);

        return res.json({token});

    } catch (err) {
        return next(err);
    }
});

module.exports = router;
