const express = require("express");
const router = express.Router();
const { requireUser, requireAdmin } = require("./utils");

// get /api/teams
router.get("/", requireAdmin, (req, res) => {
  res.send("hello from /api/teams");
});

module.exports = router;
