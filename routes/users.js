const Router = require("express").Router;
const router = new Router();
const User = require("../models/user");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");


/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/ 
router.get("/", ensureLoggedIn, async (req, res, next) =>{
    try{
        let users = await User.all();
        return res.json(users);
    } catch(err){
        next(err);
    }
})



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get("/:username", ensureLoggedIn, async (req, res, next) => {
    try{
        let { username } = req.params;
        let user = await User.get(username);
        return res.json(user);

    } catch(err){
        next(err);
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

 router.get("/:username/to", ensureCorrectUser, async function (req, res, next) {
    try {
      let messages = await User.messagesTo(req.params.username);
      return res.json({messages});
    }
  
    catch (err) {
      return next(err);
    }
  });



/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get("/:username/from",ensureLoggedIn, async (req, res, next) => {
    try {
        const {username} = req.params
        let messages = await messagesFrom(username);
        return res.json(messages);
    }
    catch(err) {
        next(err);
    }
})



module.exports = router;