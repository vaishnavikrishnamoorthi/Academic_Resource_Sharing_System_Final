const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
  addBookmark,
  getMyBookmarks,
  removeBookmark
} = require("../controllers/bookmarkController");

router.post("/", verifyToken, addBookmark);
router.get("/", verifyToken, getMyBookmarks);
router.delete("/:resource_id", verifyToken, removeBookmark);

module.exports = router;
