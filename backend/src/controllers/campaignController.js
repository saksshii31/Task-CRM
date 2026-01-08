const db = require("../config/db");

const formatDateForMySQL = (date) => {
  if (!date) return null;
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};

const getAllCampaigns = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        id,
        campaign_name,
        subject,
        sender,
        recipients,
        scheduled_at,
        status
      FROM campaigns
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (err) {
    console.error("GET campaigns error:", err);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query("SELECT * FROM campaigns WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("GET campaign error:", err);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

//create
const createCampaign = async (req, res) => {
  try {
    const {
      campaign_name,
      subject,
      email_body,
      sender,
      recipients,
      scheduled_at,
      created_by,
    } = req.body;

    const status = scheduled_at
      ? new Date(scheduled_at) <= new Date()
        ? "Sent"
        : "Scheduled"
      : "Draft";

    const [result] = await db.query(
      `
      INSERT INTO campaigns
      (campaign_name, subject, email_body, sender, recipients, scheduled_at, created_by, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        campaign_name,
        subject,
        email_body,
        sender,
        recipients,
        scheduled_at || null,
        created_by,
        status,
      ]
    );

    res.status(201).json({
      message: "Campaign created",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save campaign" });
  }
};

//update
const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      campaign_name,
      subject,
      email_body,
      sender,
      recipients,
      scheduled_at,
    } = req.body;

    const status = scheduled_at
      ? new Date(scheduled_at) <= new Date()
        ? "Sent"
        : "Scheduled"
      : "Draft";

    await db.query(
      `
      UPDATE campaigns SET
        campaign_name = ?,
        subject = ?,
        email_body = ?,
        sender = ?,
        recipients = ?,
        scheduled_at = ?,
        status = ?
      WHERE id = ?
      `,
      [
        campaign_name,
        subject,
        email_body,
        sender,
        recipients,
        scheduled_at || null,
        status,
        id,
      ]
    );

    res.json({ message: "Campaign updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update campaign" });
  }
};

//delete
const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM campaigns WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    res.json({ message: "Campaign deleted" });
  } catch (err) {
    console.error("DELETE campaign error:", err);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};

module.exports = {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
};
