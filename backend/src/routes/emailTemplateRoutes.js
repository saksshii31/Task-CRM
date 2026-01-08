const express = require("express");
const router = express.Router();
const controller = require("../controllers/emailTemplateController");

const {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../controllers/emailTemplateController");

router.get("/", controller.getAllTemplates);
router.get("/:id", controller.getTemplateById);
router.post("/", controller.createTemplate);
router.put("/:id", controller.updateTemplate);
router.delete("/:id", controller.deleteTemplate);

module.exports = router;