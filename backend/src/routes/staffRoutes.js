const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffController");

// Get all staff
router.get("/", staffController.getAllStaff);

// Get staff by ID
router.get("/:id", staffController.getStaffById);

// Create staff
router.post("/", staffController.createStaff);

// Update staff
router.put("/:id", staffController.updateStaff);

// Delete staff
router.delete("/:id", staffController.deleteStaff);



module.exports = router;
