const db = require("../config/db");
const { logActivity } = require("../utils/activityLogger");

exports.uploadResource = async (req, res) => {
  try {
    const {
      title,
      year,
      course,
      specialization,
      semester,
      subject,
      subject_code,
      unit,
      sub_unit
    } = req.body;

    // Required fields check
    if (!title || !year || !course || !semester || !subject || !unit) {
      return res.status(400).json({
        error: "Required fields are missing"
      });
    }

    // File check
    if (!req.file) {
      return res.status(400).json({
        error: "Material file is required"
      });
    }

    const file_url = req.file.path;
    const uploaded_by = req.user.id;

    // Subject Code Consistency Check
    if (subject_code) {
      const [existingSubject] = await db.query(
        "SELECT subject FROM resources WHERE subject_code = ? LIMIT 1",
        [subject_code]
      );
      if (existingSubject.length > 0 && existingSubject[0].subject !== subject) {
        return res.status(400).json({
          error: `Subject code '${subject_code}' is already assigned to the subject '${existingSubject[0].subject}'.`
        });
      }
    }

    const sql = `
      INSERT INTO resources
      (title, year, course, specialization, subject_code, semester, subject, unit, sub_unit, file_url, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.query(
      sql,
      [
        title,
        year,
        course,
        specialization || null,
        subject_code || null,
        semester,
        subject,
        unit,
        sub_unit || null,
        file_url,
        uploaded_by
      ]
    );

    logActivity(
      uploaded_by,
      "UPLOAD_RESOURCE",
      result.insertId,
      `Resource uploaded for ${course} - Sem ${semester}`
    );
    res.status(201).json({
      message: "Resource uploaded successfully",
      resourceId: result.insertId
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);
    res.status(500).json({
      error: "Server error"
    });
  }
};
exports.getResources = async (req, res) => {
  const {
    course,
    semester,
    subject,
    year,
    unit,
    sub_unit
  } = req.query;

  const role = req.user.role;

  let sql = `
    SELECT
      r.id,
      r.title,
      r.year,
      r.course,
      r.specialization,
      r.semester,
      r.subject,
      r.unit,
      r.sub_unit,
      r.file_url,
      r.created_at,
      u.name AS uploaded_by_name,
      u.role AS uploaded_by_role
    FROM resources r
    JOIN users u ON r.uploaded_by = u.id
  `;

  let conditions = [];
  let values = [];

  /* ================= STUDENT ================= */
  if (role === "student") {
    if (!course || !semester || !subject) {
      return res.status(400).json({
        error: "course, semester and subject are required"
      });
    }

    conditions.push("r.course = ?");
    conditions.push("r.semester = ?");
    conditions.push("r.subject = ?");

    values.push(course, semester, subject);
  }

  /* ============ FACULTY / ADMIN ============== */
  else if (role === "faculty" || role === "admin") {
    if (!course || !semester || !subject) {
      return res.status(400).json({
        error: "course, semester and subject are required"
      });
    }

    conditions.push("r.course = ?");
    conditions.push("r.semester = ?");
    conditions.push("r.subject = ?");

    values.push(course, semester, subject);

    if (year) {
      conditions.push("r.year = ?");
      values.push(year);
    }

    if (unit) {
      conditions.push("r.unit = ?");
      values.push(unit);
    }

    if (sub_unit) {
      conditions.push("r.sub_unit = ?");
      values.push(sub_unit);
    }
  }

  /* ================= INVALID ROLE ================= */
  else {
    return res.status(403).json({ error: "Unauthorized role" });
  }

  sql += " WHERE " + conditions.join(" AND ");
  sql += " ORDER BY r.created_at DESC";

  try {
    const [results] = await db.query(sql, values);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch resources"
    });
  }
};

const path = require("path");
exports.downloadResource = async (req, res) => {
  const { id } = req.params;

  const sql = "SELECT file_url FROM resources WHERE id = ?";

  try {
    const [result] = await db.query(sql, [id]);

    if (result.length === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const filePath = path.join(__dirname, "..", result[0].file_url);
    console.log("Attempting to download file:", filePath);

    res.download(filePath, (err) => {
      if (err) {
        console.error("res.download error:", err);
        // res.status(500).send("Could not download the file."); // Cannot send headers after sent
      }
    });
  } catch (err) {
    console.error("downloadResource error:", err);
    return res.status(500).json({ error: "Database error" });
  }
};
exports.getMyUploads = async (req, res) => {
  const userId = req.user.id;
  const role = req.user.role;

  if (role === "student") {
    return res.status(403).json({
      error: "Students are not allowed to view uploads"
    });
  }

  const sql = `
    SELECT id, title, year, course, specialization, subject_code, semester, subject, unit, sub_unit, file_url, created_at
    FROM resources
    WHERE uploaded_by = ?
    ORDER BY created_at DESC
  `;

  try {
    const [results] = await db.query(sql, [userId]);
    res.json(results);
  } catch (err) {
    return res.status(500).json({
      error: "Database error"
    });
  }
};

exports.getAllResources = async (req, res) => {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  try {
    const sql = `
      SELECT r.*, u.name as faculty_name
      FROM resources r
      JOIN users u ON r.uploaded_by = u.id
      ORDER BY r.created_at DESC
    `;

    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Database error" });
  }
};



const fs = require("fs");
exports.deleteResource = async (req, res) => {
  const resourceId = req.params.id;
  const userId = req.user.id;
  const userRole = req.user.role;

  // Step 1: Get resource
  const getSql = "SELECT * FROM resources WHERE id = ?";

  try {
    const [results] = await db.query(getSql, [resourceId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const resource = results[0];

    // Step 2: Permission check
    if (
      userRole !== "admin" &&
      !(userRole === "faculty" && resource.uploaded_by === userId)
    ) {
      return res.status(403).json({ error: "Not allowed to delete this resource" });
    }

    logActivity(
      userId,
      "DELETE_RESOURCE",
      resourceId,
      "Resource deleted by admin/faculty"
    );

    // Step 3: Delete DB record
    const deleteSql = "DELETE FROM resources WHERE id = ?";

    await db.query(deleteSql, [resourceId]);

    // Step 4: Delete file from uploads folder
    if (resource.file_url) {
      fs.unlink(resource.file_url, (fileErr) => {
        if (fileErr) {
          console.warn("File delete warning:", fileErr.message);
        }
      });
    }

    res.json({ message: "Resource deleted successfully" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to delete resource" });
  }
};
exports.updateResource = async (req, res) => {
  const resourceId = req.params.id;
  const userId = req.user.id;
  const role = req.user.role;

  const {
    year,
    course,
    specialization,
    subject_code,
    semester,
    subject,
    unit,
    sub_unit,
    title
  } = req.body;

  // Step 1: Get resource
  const getSql = "SELECT * FROM resources WHERE id = ?";

  try {
    const [results] = await db.query(getSql, [resourceId]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const resource = results[0];

    // Step 2: Permission check
    if (
      role !== "admin" &&
      !(role === "faculty" && resource.uploaded_by === userId)
    ) {
      return res.status(403).json({ error: "Not allowed to update this resource" });
    }

    // Step 3: Handle file update
    let newFileUrl = resource.file_url;
    if (req.file) {
      // Delete old file
      if (resource.file_url) {
        fs.unlink(resource.file_url, (err) => {
          if (err) console.warn("Failed to delete old file:", err.message);
        });
      }
      newFileUrl = req.file.path;
    }

    // Subject Code Consistency Check
    const finalSubjectCode = subject_code || resource.subject_code;
    const finalSubjectName = subject || resource.subject;

    if (finalSubjectCode) {
      const [existingSubject] = await db.query(
        "SELECT subject FROM resources WHERE subject_code = ? AND subject != ? LIMIT 1",
        [finalSubjectCode, finalSubjectName]
      );
      if (existingSubject.length > 0) {
        return res.status(400).json({
          error: `Subject code '${finalSubjectCode}' is already assigned to the subject '${existingSubject[0].subject}'.`
        });
      }
    }

    // Step 4: Update
    const updateSql = `
      UPDATE resources SET
  year = ?,
    course = ?,
    specialization = ?,
    subject_code = ?,
    semester = ?,
    subject = ?,
    unit = ?,
    sub_unit = ?,
    title = ?,
    file_url = ?
      WHERE id = ?
        `;

    await db.query(
      updateSql,
      [
        year,
        course,
        specialization || null,
        subject_code || null,
        semester,
        subject,
        unit,
        sub_unit || null,
        title,
        newFileUrl,
        resourceId
      ]
    );

    res.json({ message: "Resource updated successfully" });

  } catch (err) {
    return res.status(500).json({ error: "Failed to update resource" });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT DISTINCT course AS course FROM resources ORDER BY course"
    );
    console.log("getCourses fetched:", rows);
    res.json(rows);

  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getSubjects = async (req, res) => {
  try {
    const { course, semester } = req.query;
    console.log("getSubjects called with:", { course, semester });

    const [rows] = await db.query(
      "SELECT DISTINCT subject AS subject FROM resources WHERE course = ? AND semester = ? ORDER BY subject",
      [course, semester]
    );

    console.log("getSubjects found rows:", rows);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getSemesters = async (req, res) => {
  try {
    const { course, specialization } = req.query;
    console.log("getSemesters called with:", { course, specialization });

    let sql = "SELECT DISTINCT semester AS semester FROM resources WHERE course = ?";
    const values = [course];

    if (specialization) {
      sql += " AND specialization = ?";
      values.push(specialization);
    }

    sql += " ORDER BY semester";

    const [rows] = await db.query(sql, values);

    console.log("getSemesters found rows:", rows);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.getSpecializations = async (req, res) => {
  try {
    const { course } = req.query;
    console.log("getSpecializations called with course:", course);

    const [rows] = await db.query(
      "SELECT DISTINCT specialization FROM resources WHERE course = ? AND specialization IS NOT NULL ORDER BY specialization",
      [course]
    );

    console.log("getSpecializations found rows:", rows);
    res.json(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

