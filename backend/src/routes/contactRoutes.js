const express = require("express");
const router = express.Router();
const { getAllContacts } = require("../controllers/contactController");

router.get("/contacts", getAllContacts);

module.exports = router;
