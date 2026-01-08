const db = require("../config/db");

// GET ALL ROLES 
exports.getAllRoles = async (req, res) => {
  try {
    const [roles] = await db.query(
      "SELECT id, name, permissions FROM roles"
    );

    res.status(200).json(roles);
  } catch (error) {
    console.error("Get roles error:", error);
    res.status(500).json({ error: "Failed to fetch roles" });
  }
};

// GET ROLE BY ID
exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      "SELECT id, name, permissions FROM roles WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ error: "Role not found" });
    }

    // permissions is stored as JSON
    const role = rows[0];
    role.permissions = role.permissions || {};

    res.status(200).json(role);
  } catch (error) {
    console.error("Get role error:", error);
    res.status(500).json({ error: "Failed to fetch role" });
  }
};

// UPDATE ROLE PERMISSIONS
exports.updateRolePermissions = async (req, res) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!permissions || typeof permissions !== "object") {
      return res.status(400).json({ error: "Invalid permissions format" });
    }

    const [result] = await db.query(
      "UPDATE roles SET permissions = ? WHERE id = ?",
      [JSON.stringify(permissions), id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Role not found" });
    }

    res.status(200).json({ message: "Permissions updated successfully" });
  } catch (error) {
    console.error("Update permissions error:", error);
    res.status(500).json({ error: "Failed to update permissions" });
  }
};
