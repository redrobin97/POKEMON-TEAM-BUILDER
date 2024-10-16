const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

//create user in db req(id, username)
async function createUser({ username, password }) {
  const hashedpwd = await bcrypt.hash(password, SALT_COUNT);
  try {
    // const res = await client.query(
    const {
      rows: [newUser],
    } = await client.query(
      `
        INSERT INTO users(username, password) VALUES($1, $2) ON CONFLICT (username) DO NOTHING RETURNING id, username`,
      [username, hashedpwd]
    );
    // return res.rows[0];
    return newUser;
  } catch (err) {
    console.log("Error creating user...");
    throw err;
  }
}

module.exports = { createUser };
