const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Rate limit uniquement pour /login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: "Trop de tentatives. Réessayez dans 15 minutes."
});

// ROUTES
router.post("/register", AuthController.register);
router.post("/login", loginLimiter, AuthController.login);
router.get("/me", protect, AuthController.me);

router.patch("/update-password", protect, AuthController.updatePassword);
router.patch("/update-me", protect, AuthController.updateMe);

module.exports = router;
