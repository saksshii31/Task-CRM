const db = require("../config/db");

exports.getEmailAnalytics = async (req, res) => {
  try {
    const query = `
      SELECT
        c.id,
        c.campaign_name,
        c.subject,
        GROUP_CONCAT(s.sender_email ORDER BY s.sender_email SEPARATOR ', ') AS sender,
        c.recipients,
        c.scheduled_at,
        c.status
      FROM campaigns c
      LEFT JOIN senders s
        ON FIND_IN_SET(s.id, c.sender)
      GROUP BY c.id
      ORDER BY c.id DESC
    `;

    const [rows] = await db.query(query);

    res.json(
    rows
    );
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};
