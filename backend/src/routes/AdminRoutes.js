/**
 * ---------------------------------------------------------
 * ROUTES : AdminRoutes
 * ---------------------------------------------------------
 * - Accès strictement réservé aux administrateurs
 * - Toutes les routes utilisent protect + restrictTo("admin")
 * - Permet la gestion globale du blog :
 *      • Dashboard stats
 *      • Gestion utilisateurs
 *      • Gestion articles
 *      • Gestion reviews
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const AdminController = require("../controllers/AdminController");
const { protect, restrictTo } = require("../middleware/auth");

// ---------------------------------------------------------
// 🔐 PROTECTION GLOBALE
// ---------------------------------------------------------
// Toutes les routes admin sont restreintes
router.use(protect, restrictTo("admin"));

// ---------------------------------------------------------
// 📊 DASHBOARD
// ---------------------------------------------------------
router.get("/stats", AdminController.getStats);

// ---------------------------------------------------------
// 👥 USERS MANAGEMENT
// ---------------------------------------------------------
router.get("/users", AdminController.getUsers);
router.get("/users/:id", AdminController.getUser);
router.patch("/users/:id", AdminController.updateUser);
router.delete("/users/:id", AdminController.deleteUser);

// ---------------------------------------------------------
// 📝 ARTICLES MANAGEMENT
// ---------------------------------------------------------
router.get("/articles", AdminController.getArticles);
router.get("/articles/:id", AdminController.getArticle);
router.patch("/articles/:id", AdminController.updateArticle);
router.delete("/articles/:id", AdminController.deleteArticle);

// ---------------------------------------------------------
// 💬 REVIEWS MANAGEMENT
// ---------------------------------------------------------
router.get("/reviews", AdminController.getReviews);
router.delete("/reviews/:id", AdminController.deleteReview);

module.exports = router;
