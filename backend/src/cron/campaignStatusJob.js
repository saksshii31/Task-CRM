const cron = require("node-cron");
const db = require("../config/db");

cron.schedule("* * * * *", async () => {
  try {
    const [result] = await db.query(
      `
      UPDATE campaigns
      SET status = 'Sent'
      WHERE status = 'Scheduled'
      AND scheduled_at <= NOW()
      `
    );

    if (result.affectedRows > 0) {
      console.log(
        `📧 ${result.affectedRows} campaign(s) marked as Sent`
      );
    }
  } catch (error) {
    console.error("❌ Campaign status cron error:", error);
  }
});
