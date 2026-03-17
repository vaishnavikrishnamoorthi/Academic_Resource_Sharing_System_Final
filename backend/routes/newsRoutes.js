const express = require("express");
const router = express.Router();
const upload = require("../config/multer");
const verifyToken = require("../middleware/authMiddleware");
const { uploadNews, getNews, getMyNews, deleteNews } = require("../controllers/newsController");

router.post("/upload", verifyToken, upload.single("file"), uploadNews);
router.get("/", verifyToken, getNews);
router.get("/my-news", verifyToken, getMyNews);
router.delete("/:id", verifyToken, deleteNews);

module.exports = router;
