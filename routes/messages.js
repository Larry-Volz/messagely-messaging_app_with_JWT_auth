const Router = require("express").Router;
const router = new Router();
const Message = require("../models/message");
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");
const ExpressError = require("../expressError");

/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/


/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/

//QUESTION: WHY IS THIS UPDATING THE DB PROPERLY BUT NOT RETURNING THE CORRECT JSON?
//IT IS ONLY RETURNING {"message":""} 
router.post("/", ensureLoggedIn, async (req, res, next) => {
    try {
        console.log(`req.user.username from Message.create post route is ${req.user.username}`);
        let result = Message.create({
            from_username: req.user.username,
            to_username: req.body.to_username,
            body: req.body.body
        });

        return res.json({message : result});

    } catch(err) {
        next(err);
    }
})


/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/

 module.exports = router;