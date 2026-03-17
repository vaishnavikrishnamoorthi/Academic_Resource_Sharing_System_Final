const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/authMiddleware");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/users", verifyToken, authController.getUsers);
router.get("/users/filters", verifyToken, authController.getUserFilters);
router.get("/profile", verifyToken, authController.getProfile);
router.delete("/users/:id", verifyToken, authController.deleteUser);
router.put("/users/:id", verifyToken, authController.updateUser);

module.exports = router;
