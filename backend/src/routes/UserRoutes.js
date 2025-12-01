/**
 * ---------------------------------------------------------
 * ROUTES : UserRoutes
 * ---------------------------------------------------------
 * - Gestion des utilisateurs (admin only)
 * - Toutes les routes sont protégées :
 *      • protect  → nécessite un JWT valide
 *      • restrictTo("admin") → uniquement accessible aux admins
 * - Fonctionnalités :
 *      • Liste des utilisateurs
 *      • Modification du rôle
 *      • Suppression d’un utilisateur
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { protect, restrictTo } = require("../middleware/auth");

// ==============================
// GLOBAL MIDDLEWARE (Admin only)
// ==============================
router.use(protect);
router.use(restrictTo("admin"));

// ==============================
// ADMIN ROUTES
// ==============================
router.get("/", UserController.getUsers);               // Liste users
router.patch("/:id/role", UserController.updateUserRole); // Modifier rôle
router.delete("/:id", UserController.deleteUser);         // Supprimer user

module.exports = router;
