const db = require("../config/db");

/* GET all contacts */
const getAllContacts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email, phone FROM contacts ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error("Get contacts error:", err);
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

module.exports = { getAllContacts };
