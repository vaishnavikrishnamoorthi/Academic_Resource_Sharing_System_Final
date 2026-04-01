require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
require("./config/db");

// 🔥 ADDED FOR ADMIN CREATION
const bcrypt = require("bcrypt"); 

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("Created uploads directory");
}

const db = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/authRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const activityRoutes = require("./routes/activityRoutes");
const verifyToken = require("./middleware/authMiddleware");

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/news", require("./routes/newsRoutes"));
app.use("/api/ai-news", require("./routes/aiNewsRoutes")); // AI Feature — remove this line to disable


// 🔥 ADDED FOR ADMIN CREATION - START
async function createAdmin() {
  try {
    const email = "admin@admin.vcw.edu";

    const [existing] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existing.length === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);

      await db.query(
        `INSERT INTO users (name, email, password, role, status)
         VALUES (?, ?, ?, 'admin', 'active')`,
        ["Main Admin", email, hashedPassword]
      );

      console.log("✅ Admin created successfully");
    } else {
      console.log("⚠️ Admin already exists");
    }
  } catch (err) {
    console.error("❌ Error creating admin:", err.message);
  }
}
// 🔥 ADDED FOR ADMIN CREATION - END


async function testDB() {
  try {
    const connection = await db.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
}

testDB();

app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Protected route accessed",
    user: req.user
  });
});

app.get("/", (req, res) => {
  res.send("Academic Resource Sharing System Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);

  // 🔥 ADDED FOR ADMIN CREATION
  await createAdmin(); 
});