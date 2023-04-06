const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  async (req, res) => {
    try {
      const token = jwt.sign({ sub: req.user.id }, config.jwtSecret, {
        expiresIn: "1d",
      });
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = router;
