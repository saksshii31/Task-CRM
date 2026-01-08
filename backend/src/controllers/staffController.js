const db = require("../config/db");

// convert role name or id into roleId
const getRoleId = async (roleInput) => {
  console.log("🔍 getRoleId input:", roleInput, "type:", typeof roleInput);
  
  // role is numeric
  if (!isNaN(roleInput)) {
    const roleId = Number(roleInput);
    console.log("✅ Using numeric roleId:", roleId);
    return roleId > 0 ? roleId : null;
  }
  
  // role is string/name
  const [rows] = await db.query("SELECT id FROM roles WHERE name = ?", [
    roleInput,
  ]);
  console.log("📋 Query result for name:", rows);
  return rows.length ? rows[0].id : null;
};

//gets all staff by name
exports.getAllStaff = async (req, res) => {
  try {
    const query = `
      SELECT s.*, r.name AS role
      FROM staff s
      JOIN roles r ON s.role_id = r.id
    `;
    const [staff] = await db.query(query);
    res.status(200).json(staff);
    
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};


//gets all staff by id (edit page prefill)
exports.getStaffById = async (req, res) => {
  try {
    const { id } = req.params;

    const query = `
      SELECT s.*, r.name AS role
      FROM staff s
      JOIN roles r ON s.role_id = r.id
      WHERE s.id = ?
    `;
    const [staff] = await db.query(query, [id]);

    if (!staff.length) {
      return res.status(404).json({ error: "Staff not found" });
    }

    res.status(200).json(staff[0]);
  } catch (error) {
    console.error("Error fetching staff:", error);
    res.status(500).json({ error: "Failed to fetch staff" });
  }
};

//create staff
exports.createStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, role, status } = req.body;
    console.log("📝 Create Staff Request:", { firstName, lastName, email, phone, role, status });

    if (!firstName || !lastName || !email || !phone || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // convert role name or id into role_id
    const roleId = await getRoleId(role);
    console.log(" roleId:", roleId);
    if (!roleId) {
      return res.status(400).json({ error: "Invalid role. Available roles: 1(Admin), 2(Sales), 3(Marketing)" });
    }

    const query = `
      INSERT INTO staff (first_name, last_name, email, phone, role_id, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(query, [
      firstName,
      lastName,
      email,
      phone,
      roleId,
      status || "active",
    ]);
    alert("Staff created successfullyy!");
    res.status(201).json({
      message: "Staff created successfully",
      id: result.insertId,
    });
  } catch (err) {
  console.error("Error creating staff:", err);

  if (err.code === "ER_DUP_ENTRY") {
    return res.status(400).json({
      success: false,
      message: "Email already exists",
    });
  }

  return res.status(500).json({
    success: false,
    message: "Server error",
  });
}
};

//update staff
exports.updateStaff = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, role, status } = req.body;

    if (!firstName || !lastName || !email || !phone || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const roleId = await getRoleId(role);
    if (!roleId) {
      return res.status(400).json({ error: "Invalid role" });
    }

    const query = `
      UPDATE staff
      SET first_name = ?, last_name = ?, email = ?, phone = ?, role_id = ?, status = ?
      WHERE id = ?
    `;

    const [result] = await db.query(query, [
      firstName,
      lastName,
      email,
      phone,
      roleId,
      status || "active",
      id,
    ]);

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Staff not found" });
    }
    alert("Staff updated successfullyy!");
    res.status(200).json({ message: "Staff updated successfully" });
  } catch (error) {
    console.error("Error updating staff:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to update staff" });
  }
};

//delete staff
exports.deleteStaff = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query("DELETE FROM staff WHERE id = ?", [id]);

    if (!result.affectedRows) {
      return res.status(404).json({ error: "Staff not found" });
    }
    alert("Staff deleted successfullyy!");
    res.status(200).json({ message: "Staff deleted successfully" });
  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({ error: "Failed to delete staff" });
  }
};
