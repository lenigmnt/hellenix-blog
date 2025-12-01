/**
 * ---------------------------------------------------------
 * ROUTES : AuthRoutes
 * ---------------------------------------------------------
 * - Gestion complète de l’authentification :
 *      • Register
 *      • Login + rate-limit
 *      • Profil utilisateur (me)
 *      • Update profil / password
 *
 * - protect → nécessite un JWT valide
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { protect } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// ==============================
// RATE LIMIT uniquement pour /login
// ==============================
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,      // 15 minutes
    max: 5,                        // 5 tentatives max
    message: "Trop de tentatives. Réessayez dans 15 minutes."
});

// ==============================
// AUTH PUBLIC ROUTES
// ==============================
router.post("/register", AuthController.register);
router.post("/login", loginLimiter, AuthController.login);

// ==============================
// AUTH PROTECTED ROUTES
// ==============================
router.get("/me", protect, AuthController.me);

router.patch("/update-password", protect, AuthController.updatePassword);
router.patch("/update-me", protect, AuthController.updateMe);

module.exports = router;
