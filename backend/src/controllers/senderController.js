const db = require("../config/db");

/* GET all senders */
exports.getAllSenders = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT id, sender_name, sender_email FROM senders ORDER BY id DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch senders" });
  }
};

/* CREATE sender */
exports.getAllSenders = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, sender_name, sender_email FROM senders ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch senders" });
  }
};

/* CREATE sender */
exports.createSender = async (req, res) => {
  try {
    const { sender_name, sender_email } = req.body;

    if (!sender_name || !sender_email) {
      return res.status(400).json({ message: "Name and email required" });
    }

    const [result] = await db.query(
      "INSERT INTO senders (sender_name, sender_email) VALUES (?, ?)",
      [sender_name, sender_email]
    );

    res.status(201).json({
      id: result.insertId,
      sender_name,
      sender_email,
    });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Sender email already exists",
      });
    }

    console.error(err);
    res.status(500).json({ message: "Database error" });
  }
};


/* UPDATE sender */
exports.updateSender = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender_name, sender_email } = req.body;

    await db.query(
      `UPDATE senders
       SET sender_name = ?, sender_email = ?
       WHERE id = ?`,
      [sender_name, sender_email, id]
    );

    res.json({ message: "Sender updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update sender" });
  }
};

/* DELETE sender */
exports.deleteSender = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query("DELETE FROM senders WHERE id = ?", [id]);

    res.json({ message: "Sender deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete sender" });
  }
};
