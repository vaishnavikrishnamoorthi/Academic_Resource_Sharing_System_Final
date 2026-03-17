const db = require("../config/db");

exports.addBookmark = async (req, res) => {

  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can bookmark resources" });
  }

  const user_id = req.user.id;
  const { resource_id } = req.body;

  if (!resource_id) {
    return res.status(400).json({ error: "Resource ID is required" });
  }

  try {
    // Check if already bookmarked
    const [existing] = await db.query(
      "SELECT * FROM bookmarks WHERE user_id = ? AND resource_id = ?",
      [user_id, resource_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({ error: "Resource already bookmarked" });
    }

    const sql = `
      INSERT INTO bookmarks (user_id, resource_id)
      VALUES (?, ?)
    `;

    await db.query(sql, [user_id, resource_id]);
    res.status(201).json({ message: "Resource bookmarked successfully" });

  } catch (err) {
    console.error("Error adding bookmark:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.getMyBookmarks = async (req, res) => {

  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can view bookmarks" });
  }

  const user_id = req.user.id;

  const sql = `
    SELECT r.*
    FROM bookmarks b
    JOIN resources r ON b.resource_id = r.id
    WHERE b.user_id = ?
    ORDER BY b.created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [user_id]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching bookmarks:", err);
    res.status(500).json({ error: "Database error" });
  }
};

exports.removeBookmark = async (req, res) => {

  if (req.user.role !== "student") {
    return res.status(403).json({ error: "Only students can remove bookmarks" });
  }

  const user_id = req.user.id;
  const { resource_id } = req.params;

  const sql = `
    DELETE FROM bookmarks
    WHERE user_id = ? AND resource_id = ?
  `;

  try {
    await db.query(sql, [user_id, resource_id]);
    res.json({ message: "Bookmark removed successfully" });
  } catch (err) {
    console.error("Error removing bookmark:", err);
    res.status(500).json({ error: "Database error" });
  }
};
