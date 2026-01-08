const express = require("express");
const router = express.Router();
const roleController = require("../controllers/roleController");

// GET all roles
router.get("/", roleController.getAllRoles);

// GET role by ID
router.get("/:id", roleController.getRoleById);

// UPDATE permissions by role ID
router.put("/:id", roleController.updateRolePermissions);

module.exports = router;
