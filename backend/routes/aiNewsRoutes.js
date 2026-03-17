// AI News Recommendations Routes
// This file is isolated — delete it to remove the AI feature

const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");
const { getNewsRecommendations } = require("../controllers/aiNewsController");

router.get("/recommendations", verifyToken, getNewsRecommendations);

module.exports = router;
