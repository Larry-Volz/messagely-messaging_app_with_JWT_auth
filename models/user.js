const ExpressError = require("../expressError");
const db = require("../db");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

/** User class for message.ly */


/** User of the site. */

class User {

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */

  static async register({username, password, first_name, last_name, phone}) { 
    //notice the deconstructing of req.body within the signature above

    //hash password w/secret code with bcrypt
    const HASHED_PASSWORD = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    
    //store all in db
    const result = await db.query(`
    INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
    VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
    RETURNING username, password, first_name, last_name, phone`,
    [username, HASHED_PASSWORD, first_name, last_name, phone]);

      console.log(`${result.rows[0]} = reult.rows[0] from User.register`)

    return result.rows[0];
  }

  /** Authen)ticate: is this username/password valid? Returns boolean. */

  static async authenticate(username, password) {

    //look up hashed password from db
    const result = await db.query( `
    SELECT password
    FROM users
    WHERE username=$1`,
    [username]);

    let user = result.rows[0];
    return user && await bcrypt.compare(password, user.password);

  }

  /** Update last_login_at for user */

  static async updateLoginTimestamp(username) { 
    const result = await db.query(`
    UPDATE users
    SET last_login_at = current_timestamp
    WHERE username = $1`,
    [username]);
  }

  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */

  static async all() { 

    
    //NOTE: in the body must be {"token":token} to get a result for any of these
    
    const result = await db.query(`
    SELECT username, first_name, last_name, phone, join_at, last_login_at
    FROM users
    ORDER BY username`);
    
    return result.rows;
    
  }
  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */

  static async get(username) { 
    const result = await db.query(`
    SELECT username, first_name, last_name, phone, join_at, last_login_at
    FROM users
    WHERE username = $1`,
    [username]);

    return result.rows;
  }

  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesFrom(username) { 

    const result = await db.query(`
      SELECT m.id, m.to_username, u.first_name, u.last_name, u.phone, m.body, m.sent_at, m.read_at
      FROM messages AS m
      JOIN users AS u ON m.to_username = u.username
      WHERE from_username = $1`,
      [username]);

    return result.rows.map(m => ({
      id: m.id,
      to_user: {
        username: m.to_username,
        first_name: m.first_name,
        last_name: m.last_name,
        phone: m.phone
      },
      body: m.body,
      sent_at: m.sent_at,
      read_at: m.read_at
    }));
  }

  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */

  static async messagesTo(username) { }
} 


module.exports = User;