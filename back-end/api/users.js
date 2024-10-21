const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  getUser,
  getUserByUsername,
  createUser,
  deleteUser,
} = require("../db/users");
const { JWT_SECRET = "ef3f31f31f31oegnoergf" } = process.env;

// get request /api/users
router.get("/", (req, res) => {
  res.send("hello from /api/users");
});

// POST api/users/login
router.post("/login", async (req, res, next) => {
  //check for username and password
  const { username, password } = req.body;
  //if not provided => send err
  try {
    if (!username || !password) {
      next({
        name: "MissingCredentials",
        message: "Please supply a username and password",
      });
    }

    //if provided query database for the user by username and password
    const user = await getUser({ username, password });
    console.log(user);
    //if no user send incorrect creds
    if (!user) {
      next({
        name: "IncorrectCredentials",
        message: "Username or password is incorrect",
      });
    } else {
      //create token
      const token = jwt.sign(
        { id: user.id, username: user.username },
        JWT_SECRET,
        { expiresIn: `1w` }
      );
      res.send({ user, message: "Logged in successfully", token });
    }
  } catch (err) {
    next(err);
  }
});

//register user
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      next({
        name: "MissingCredentials",
        message: "Must provide a username and password",
      });
    }
    const matchedUsername = await getUserByUsername(username);
    if (matchedUsername) {
      res.status(401);
      next({
        name: "MatchedUsername",
        message: "Username already exists",
      });
    } else if (password.length < 8) {
      next({
        name: "PasswordLength",
        message: "Password must be atleast 8 characters",
      });
    } else {
      const newUser = await createUser({ username, password });
      if (!newUser) {
        next({
          name: "UserCreationError",
          message:
            "There was a problem creating your account. Please try again",
        });
      }
      const token = jwt.sign(
        { id: newUser.id, username: newUser.username },
        JWT_SECRET,
        { expiresIn: `1w` }
      );
      res.send({ newUser, message: "Welcome new user!", token });
    }
  } catch (err) {
    next(err);
  }
});

//delete a user
router.put("/delete", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    //check if user exists
    const deletedUser = await deleteUser({ username, password });
    //handle no user
    if (!deletedUser) {
      next({ name: "UserNotFound", message: "No user to delete" });
    }
    //
    const { user } = deletedUser;
    res.send({ user, message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;