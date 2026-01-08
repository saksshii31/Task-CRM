const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  forgetPassword,
  resetPassword,
  logout,
  changePassword,
} = require("../controllers/authController"); 

router.post("/register", register);
router.post("/login", login);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.post("/logout", logout);
router.post("/changePassword", authMiddleware, changePassword);

module.exports = router;
