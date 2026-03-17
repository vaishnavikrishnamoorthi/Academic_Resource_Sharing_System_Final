const db = require("../config/db");

const logActivity = async (userId, action, resourceId = null, description = null) => {
  const sql = `
    INSERT INTO activity_logs (user_id, action, resource_id, description)
    VALUES (?, ?, ?, ?)
  `;

  try {
    await db.query(sql, [userId, action, resourceId, description]);
    console.log("Activity Logged Successfully");
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};

module.exports = { logActivity };
