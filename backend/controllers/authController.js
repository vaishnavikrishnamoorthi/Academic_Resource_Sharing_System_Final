const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  const { name, email: rawEmail, password, role, roll_number, year, course, specialization } = req.body;
  const email = rawEmail?.toLowerCase().trim();

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "All fields required" });
  }

  // Role-Based Email Validation
  const emailDomains = {
    student: "@vcw.com",
    faculty: "@vcw.edu",
    admin: "@admin.vcw.edu",
  };

  if (!emailDomains[role] || !email.endsWith(emailDomains[role])) {
    return res.status(400).json({
      error: `Email for ${role} must end with ${emailDomains[role] || "the appropriate domain"}.`
    });
  }

  // Roll Number Validation (YYSSNNN)
  if (roll_number) {
    const rollPattern = role === "student" ? /^\d{2}[A-Z]{2}\d{3}$/ : /^[A-Z]{2}[A-Z]{2}\d{3}$/;
    if (!rollPattern.test(roll_number)) {
      return res.status(400).json({ 
        error: `Invalid Roll Number format. Use ${role === "student" ? "YYSSNNN (e.g., 22CS001)" : "RRSSNNN (e.g., FFCS001)"}` 
      });
    }
  }

  try {
    // Check if Roll Number is already taken
    if (roll_number) {
      const [existingRoll] = await db.query("SELECT id FROM users WHERE roll_number = ?", [roll_number]);
      if (existingRoll.length > 0) {
        return res.status(400).json({ error: "Roll Number is already registered" });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = `INSERT INTO users (name, email, password, role, roll_number, year, course, specialization) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    await db.query(sql, [
      name,
      email,
      hashedPassword,
      role,
      roll_number || null,
      year || null,
      course || null,
      specialization || null,
    ]);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already registered" });
    }
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email: rawEmail, password } = req.body;
  const email = rawEmail?.toLowerCase().trim();

  try {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [results] = await db.query(sql, [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      role: user.role,
      name: user.name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [results] = await db.query(
      "SELECT id, name, email, role, roll_number, year, course, specialization, created_at FROM users WHERE id = ?",
      [userId]
    );

    if (results.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  const { filter, courses, specializations, years } = req.query;

  let sql = "SELECT id, name, email, role, roll_number, year, course, specialization, created_at FROM users WHERE role != 'admin'";
  const values = [];

  if (filter === "student" || filter === "faculty") {
    sql = "SELECT id, name, email, role, roll_number, year, course, specialization, created_at FROM users WHERE role = ?";
    values.push(filter);
  }

  // Multi-select filters
  if (courses) {
    const list = courses.split(",");
    sql += ` AND course IN (${list.map(() => "?").join(",")})`;
    values.push(...list);
  }
  if (specializations) {
    const list = specializations.split(",");
    sql += ` AND specialization IN (${list.map(() => "?").join(",")})`;
    values.push(...list);
  }
  if (years) {
    const list = years.split(",");
    sql += ` AND year IN (${list.map(() => "?").join(",")})`;
    values.push(...list);
  }

  sql += " ORDER BY created_at DESC";

  try {
    const [results] = await db.query(sql, values);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getUserFilters = async (req, res) => {
  const role = req.user.role;
  if (role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  const filterRole = req.query.role || "student";

  try {
    const [courseRows] = await db.query(
      "SELECT DISTINCT course FROM users WHERE role = ? AND course IS NOT NULL ORDER BY course",
      [filterRole]
    );
    const [specRows] = await db.query(
      "SELECT DISTINCT specialization FROM users WHERE role = ? AND specialization IS NOT NULL ORDER BY specialization",
      [filterRole]
    );
    const [yearRows] = await db.query(
      "SELECT DISTINCT year FROM users WHERE role = ? AND year IS NOT NULL ORDER BY year",
      [filterRole]
    );

    res.json({
      courses: courseRows.map((r) => r.course),
      specializations: specRows.map((r) => r.specialization),
      years: yearRows.map((r) => r.year),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch filter options" });
  }
};

exports.deleteUser = async (req, res) => {
  const role = req.user.role;

  if (role !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  const userId = req.params.id;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user[0].role === "admin") {
      return res.status(403).json({ error: "Cannot delete admin users" });
    }

    await db.query("DELETE FROM users WHERE id = ?", [userId]);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete user" });
  }
};

exports.updateUser = async (req, res) => {
  const adminRole = req.user.role;

  if (adminRole !== "admin") {
    return res.status(403).json({ error: "Admin access only" });
  }

  const userId = req.params.id;
  const { name, email, roll_number, year, course, specialization } = req.body;

  try {
    const [user] = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user[0].role === "admin") {
      return res.status(403).json({ error: "Cannot update admin users" });
    }

    // Roll Number Validation & Uniqueness
    if (roll_number && roll_number !== user[0].roll_number) {
      const targetRole = user[0].role;
      const rollPattern = targetRole === "student" ? /^\d{2}[A-Z]{2}\d{3}$/ : /^[A-Z]{2}[A-Z]{2}\d{3}$/;
      if (!rollPattern.test(roll_number)) {
        return res.status(400).json({ 
          error: `Invalid Roll Number format. Use ${targetRole === "student" ? "YYSSNNN (e.g., 22CS001)" : "RRSSNNN (e.g., FFCS001)"}` 
        });
      }

      const [existingRoll] = await db.query("SELECT id FROM users WHERE roll_number = ? AND id != ?", [roll_number, userId]);
      if (existingRoll.length > 0) {
        return res.status(400).json({ error: "Roll Number is already taken" });
      }
    }

    // Email Domain Validation
    if (email && email !== user[0].email) {
      const targetRole = user[0].role;
      const emailDomains = {
        student: "@vcw.com",
        faculty: "@vcw.edu",
        admin: "@admin.vcw.edu"
      };

      if (!email.endsWith(emailDomains[targetRole])) {
        return res.status(400).json({
          error: `Email for ${targetRole} must end with ${emailDomains[targetRole]}`
        });
      }
    }

    const sql = `
      UPDATE users 
      SET name = ?, email = ?, roll_number = ?, year = ?, course = ?, specialization = ?
      WHERE id = ?
    `;

    await db.query(sql, [
      name || user[0].name,
      email || user[0].email,
      roll_number || user[0].roll_number,
      year || user[0].year,
      course || user[0].course,
      specialization || user[0].specialization,
      userId
    ]);

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "Email already exists" });
    }
    res.status(500).json({ error: "Failed to update user" });
  }
};
