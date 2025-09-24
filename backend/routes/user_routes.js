
const express = require("express");
const router = express.Router();
const { register, login, update_user, user_me } = require("../controller/userController");
const authuser = require("../middleware/authuser");

router.get("/me", authuser, user_me);

router.post("/signup", register);

router.post("/login", login);

router.post("/logout", (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logged out successfully" });
});


router.put("/:userId", authuser, update_user);

module.exports = router;
