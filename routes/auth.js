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

router.post("/login", async (req, res, next)=>{
    try {
        const { username, password } = req.body;
        const validated = user.authenticate(username, password);
        if(validated){
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token });
        }

    } catch(err) {
        next(err);
    }
});


/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */ 
router.post("/register", async function (req, res, next) {
    try {
        //get payload
        let { username } = await user.register(req.body);  
        //return token
        let token = jwt.sign({username}, SECRET_KEY);
        console.log(`Token = ${token}`);

        
        user.updateLoginTimestamp(username);

        return res.json({token}); //to be stored by client locally

    } catch (err) {
        return next(err);
    }
});

module.exports = router;
