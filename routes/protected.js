const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ message: "You have access to this protected resource!" });
});

module.exports = router;