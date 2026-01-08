const db = require("../config/db");

/* GET all templates */
const getAllTemplates = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, template_name, subject, email_body FROM email_templates ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch templates" });
  }
};

/* GET template by ID */
const getTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT * FROM email_templates WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Template not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch template" });
  }
};

/* CREATE template */
const createTemplate = async (req, res) => {
  try {
    const { template_name, subject, email_body, created_by } = req.body;

    await db.query(
      `INSERT INTO email_templates (template_name, subject, email_body, created_by)
       VALUES (?, ?, ?, ?)`,
      [template_name, subject, email_body, created_by]
    );

    res.json({ message: "Template created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create template" });
  }
};

/* UPDATE template */
const updateTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { template_name, subject, email_body } = req.body;

    await db.query(
      `UPDATE email_templates
       SET template_name = ?, subject = ?, email_body = ?
       WHERE id = ?`,
      [template_name, subject, email_body, id]
    );

    res.json({ message: "Template updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update template" });
  }
};

/* DELETE template */
const deleteTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM email_templates WHERE id = ?", [id]);
    res.json({ message: "Template deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete template" });
  }
};

/* VERY IMPORTANT */
module.exports = {
  getAllTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
};
