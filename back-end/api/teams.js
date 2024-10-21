const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");

// get /api/teams
router.get("/", requireUser, (req, res) => {
  res.send("hello from /api/teams");
});

module.exports = router;
