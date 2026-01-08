const express = require("express");
const router = express.Router();
const senderController = require("../controllers/senderController");

router.get("/", senderController.getAllSenders);
router.post("/", senderController.createSender);
router.put("/:id", senderController.updateSender);
router.delete("/:id", senderController.deleteSender);

module.exports = router;
