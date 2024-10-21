const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getUserById } = require("../db/users");
const { JWT_SECRET = "ef3f31f31f31oegnoergf" } = process.env;

//authorization middleware
router.use(async (req, res, next) => {
  const prefix = "Bearer ";
  const auth = req.header("Authorization");
  if (!auth) {
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);
    try {
      const parsedToken = jwt.verify(token, JWT_SECRET);
      const id = parsedToken && parsedToken.id;
      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch (err) {
      next(err);
    }
  } else {
    next({
      name: "AuthorizationHeaderError",
      message: `Authoization token must start with ${prefix}`,
    });
  }
});

//set user
router.use((req, res, next) => {
  if (req.user) {
    console.log("User is set: ", req.user);
  }
  next();
});

//router to use /users
router.use("/users", require("./users"));

//router to use /teams
router.use("/teams", require("./teams"));

//router to use /pokemons
router.use("/pokemon", require("./pokemon"));

module.exports = router;
