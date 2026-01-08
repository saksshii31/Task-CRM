const express = require("express");
const router = express.Router();

const { getEmailAnalytics } = require("../controllers/analyticsController");

router.get("/", getEmailAnalytics);

module.exports = router;
