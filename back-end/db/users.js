const client = require("./client");
const bcrypt = require("bcrypt");
const SALT_COUNT = 10;

//create user in db req(id, username)
async function createUser({ username, password, role }) {
  try {
    const hashedpwd = await bcrypt.hash(password, SALT_COUNT);
    // const res = await client.query(
    const {
      rows: [newUser],
    } = await client.query(
      `
        INSERT INTO users(username, password, role) VALUES($1, $2, $3) ON CONFLICT (username) DO NOTHING RETURNING id, username`,
      [username, hashedpwd, role]
    );
    if (!newUser) return null;
    // return res.rows[0];
    return newUser;
  } catch (err) {
    throw err;
  }
}

//get user by username
async function getUserByUsername({ username }) {
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
    const user = await getUserByUsername({ username });
    if (!user) {
      return null;
    }
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
async function getUserById({ id }) {
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

    return { user: userToDelete };
  } catch (err) {
    throw err;
  }
}
//change password taking username, password
async function updatePassword({ username, password, newPassword }) {
  try {
    const userToChange = await getUser({ username, password });
    if (!userToChange) return null;
    const hashedpwd = await bcrypt.hash(newPassword, SALT_COUNT);
    const { rowCount } = await client.query(
      `
          UPDATE users SET password = $1 WHERE username = $2`,
      [hashedpwd, username]
    );

    if (rowCount === 0) return null;

    return { message: "Password updated successfully", user: userToChange };
  } catch (err) {
    throw err;
  }
}

//change username
async function updateUsername({ id, newUsername }) {
  try {
    const userToChange = await getUserById(id);
    if (!userToChange) return null;
    const { rowCount } = await client.query(
      `
      UPDATE users SET username = $1 WHERE id = $2`,
      [newUsername, id]
    );
    if (rowCount === 0) return null;
    const updatedUser = await getUserById(id);
    return { message: "Username changed successfully", user: updatedUser };
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
  updatePassword,
  updateUsername,
};
