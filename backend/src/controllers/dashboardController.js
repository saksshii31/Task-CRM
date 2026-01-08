const db = require("../config/db");

exports.getDashboardStats = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT status, COUNT(*) as count
      FROM campaigns
      GROUP BY status
    `);

    // Convert to frontend-friendly format
    const stats = {
      Sent: 0,
      Scheduled: 0,
      Draft: 0,
      Failed: 0,
    };

    rows.forEach(row => {
      stats[row.status] = row.count;
    });

    res.json([
      { name: "Sent", value: stats.Sent },
      { name: "Scheduled", value: stats.Scheduled },
      { name: "Draft", value: stats.Draft },
      { name: "Failed", value: stats.Failed },
    ]);
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json([]);
  }
};
