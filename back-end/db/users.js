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

//get user by username
async function getUserByUsername(username) {
  try {
    const { rows } = await client.query(
      `SELECT * FROM users WHERE username = $1`,
      [username]
    );
    if (!rows || !rows.length) return null;
    const [user] = rows;
    return user;
  } catch (err) {
    throw err;
  }
}

//get a user and check user password
async function getUser({ username, password }) {
  if (!username || !password) return;
  try {
    const user = await getUserByUsername(username);
    if (!user) return;
    const hashedpwd = user.password;
    const passwordMatch = await bcrypt.compare(password, hashedpwd);
    if (!passwordMatch) return;
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
}

//get user by userid
async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(`SELECT * FROM users WHERE id = $1`, [id]);
    if (!user) return null;
    delete user.password;
    return user;
  } catch (err) {
    throw err;
  }
}

//delete a user by username and password
async function deleteUser({ username, password }) {
  try {
    const userToDelete = await getUser({ username, password });
    if (!userToDelete) return null;

    const deleteQuery = await client.query(
      `
        DELETE FROM users WHERE username = $1`,
      [username]
    );

    return { user: userToDelete, result: deleteQuery };
  } catch (err) {
    throw err;
  }
}

module.exports = {
  createUser,
  getUser,
  getUserByUsername,
  deleteUser,
  getUserById,
};
