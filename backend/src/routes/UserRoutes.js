const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { protect, restrictTo } = require("../middleware/auth");

// Toutes les routes /users sont protégées + réservées à admin
router.use(protect);
router.use(restrictTo("admin"));

// ROUTES
router.get("/", UserController.getUsers);
router.patch("/:id/role", UserController.updateUserRole);
router.delete("/:id", UserController.deleteUser);

module.exports = router;
