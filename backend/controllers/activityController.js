const db = require("../config/db");

exports.getAllActivities = (req, res) => {

  const sql = `
    SELECT 
      activity_logs.*, 
      users.name, 
      resources.course,
      resources.semester,
      resources.subject,
      resources.unit
    FROM activity_logs
    LEFT JOIN users ON activity_logs.user_id = users.id
    LEFT JOIN resources ON activity_logs.resource_id = resources.id
    ORDER BY activity_logs.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    res.json(results);
  });
};
