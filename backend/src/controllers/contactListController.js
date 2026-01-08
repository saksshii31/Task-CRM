const db = require("../config/db");

exports.getAllContactLists = async (req, res) => {
  try {
    const [rows] = await db.query(`
    SELECT
    cl.id,
    cl.list_name,
    cl.description,
    COUNT(DISTINCT clm.contact_id) AS total_contacts
    FROM contact_lists cl
    LEFT JOIN contact_list_mapping clm
    ON cl.id = clm.contact_list_id
    GROUP BY cl.id, cl.list_name, cl.description
    ORDER BY cl.id DESC;
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contact lists" });
  }
};

exports.getAllContacts = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, name, email FROM contacts ORDER BY name"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch contacts" });
  }
};

exports.getContactListById = async (req, res) => {
  try {
    const { id } = req.params;

    const [[list]] = await db.query(
      `SELECT id, list_name, description
       FROM contact_lists
       WHERE id = ?`,
      [id]
    );

    if (!list) {
      return res.status(404).json({ error: "List not found" });
    }

    const [contacts] = await db.query(
      `SELECT contact_id
       FROM contact_list_mapping
       WHERE contact_list_id = ?`,
      [id]
    );

    res.json({
      ...list,
      contacts: contacts.map((c) => c.contact_id),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch contact list" });
  }
};

//create
exports.createContactList = async (req, res) => {
  const { list_name, description, contacts, created_by } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO contact_lists (list_name, description, created_by)
       VALUES (?, ?, ?)`,
      [list_name, description, created_by]
    );

    const listId = result.insertId;

    if (Array.isArray(contacts)) {
      for (const contactId of contacts) {
        await db.query(
          `INSERT INTO contact_list_mapping (contact_list_id, contact_id)
           VALUES (?, ?)`,
          [listId, contactId]
        );
      }
    }

    res.json({ message: "Contact list created" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create contact list" });
  }
};

//update
exports.updateContactList = async (req, res) => {
  const { id } = req.params;
  const { list_name, description, contacts } = req.body;

  try {
    // Update list info
    await db.query(
      `UPDATE contact_lists
       SET list_name = ?, description = ?
       WHERE id = ?`,
      [list_name, description, id]
    );

    // 🔥 CRITICAL: remove old contacts
    await db.query(
      `DELETE FROM contact_list_mapping
       WHERE contact_list_id = ?`,
      [id]
    );

    // Insert new contacts
    if (Array.isArray(contacts)) {
      for (const contactId of contacts) {
        await db.query(
          `INSERT INTO contact_list_mapping (contact_list_id, contact_id)
           VALUES (?, ?)`,
          [id, contactId]
        );
      }
    }

    res.json({ message: "Contact list updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update contact list" });
  }
};


//delete
exports.deleteContactList = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM contact_lists WHERE id = ?", [id]);

    res.json({ message: "Contact deleted successfullyy!" });
    alert(data.message);
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: "Failed to delete contact list" });
  }
};
