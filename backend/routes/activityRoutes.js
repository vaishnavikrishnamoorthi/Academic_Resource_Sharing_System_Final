const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const allowUpload = require("../middleware/allowUpload");
const { getAllActivities } = require("../controllers/activityController");

// Only admin can see activity logs
router.get(
  "/",
  verifyToken,
  allowUpload, // we modify this to allow only admin
  getAllActivities
);

module.exports = router;
