const db = require("../config/db");
const { logActivity } = require("../utils/activityLogger");

exports.uploadNews = async (req, res) => {
    try {
        const { title, source } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ error: "Title is required" });
        }

        let type = "link";
        let content = source || "";

        if (req.file) {
            type = req.file.mimetype.startsWith("image/") ? "image" : "file";
            content = req.file.path;
        } else if (!source) {
            return res.status(400).json({ error: "Source (link or file) is required" });
        }

        const sql = `
            INSERT INTO news (title, type, content, uploaded_by)
            VALUES (?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [title, type, content, userId]);

        logActivity(userId, "UPLOAD_NEWS", result.insertId, `News uploaded: ${title}`);

        res.status(201).json({
            message: "News uploaded successfully",
            newsId: result.insertId
        });

    } catch (error) {
        console.error("News Upload Error:", error);
        res.status(500).json({
            error: "Server error during news upload",
            details: error.message
        });
    }
};

exports.getNews = async (req, res) => {
    try {
        const sql = `
            SELECT n.*, u.name as uploaded_by_name 
            FROM news n 
            JOIN users u ON n.uploaded_by = u.id 
            ORDER BY n.created_at DESC
        `;
        const [results] = await db.query(sql);
        res.json(results);
    } catch (error) {
        console.error("Get News Error:", error);
        res.status(500).json({ error: "Failed to fetch news" });
    }
};

exports.getMyNews = async (req, res) => {
    try {
        const userId = req.user.id;
        const sql = `
            SELECT * FROM news 
            WHERE uploaded_by = ? 
            ORDER BY created_at DESC
        `;
        const [results] = await db.query(sql, [userId]);
        res.json(results);
    } catch (error) {
        console.error("Get My News Error:", error);
        res.status(500).json({ error: "Failed to fetch your news" });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const newsId = req.params.id;
        const userId = req.user.id;

        // Check ownership
        const [news] = await db.query("SELECT * FROM news WHERE id = ?", [newsId]);
        if (news.length === 0) return res.status(404).json({ error: "News not found" });

        if (news[0].uploaded_by !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Unauthorized to delete this news" });
        }

        // Delete file if exists (optional implementation, can be added later if needed)
        // const fs = require('fs');
        // if (news[0].type === 'file' || news[0].type === 'image') { ... }

        await db.query("DELETE FROM news WHERE id = ?", [newsId]);
        res.json({ message: "News deleted successfully" });

    } catch (error) {
        console.error("Delete News Error:", error);
        res.status(500).json({ error: "Failed to delete news" });
    }
};
