const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const auth = require("../middleware/authMiddleware");

router.use(auth);
router.get("/", getDashboardStats);


module.exports = router;
