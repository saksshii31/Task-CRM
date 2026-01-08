const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");
// const auth = require("../middleware/authMiddleware");
// const permit = require("../middleware/permissionMiddleware");

const {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require("../controllers/campaignController");

router.get(
  "/",
  campaignController.getAllCampaigns
);
router.get("/:id", campaignController.getCampaignById);
router.post("/",  campaignController.createCampaign);
router.put("/:id", campaignController.updateCampaign);
router.delete("/:id", campaignController.deleteCampaign);

module.exports = router;
