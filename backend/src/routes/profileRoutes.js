const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

/* GET profile */
router.get("/", authMiddleware, getProfile);

/* UPDATE profile */
router.put("/", authMiddleware, updateProfile);

module.exports = router;
