/**
 * ---------------------------------------------------------
 * ROUTES : UserRoutes
 * ---------------------------------------------------------
 * - Gestion des utilisateurs
 * - Deux groupes de routes :
 *      1) Routes USER (protégées mais NON admin)
 *      2) Routes ADMIN (protégées + admin strict)
 * 
 * - USER peut :
 *      • Voir son profil
 *      • Modifier son profil
 *      • Changer son mot de passe
 *
 * - ADMIN peut :
 *      • Voir tous les utilisateurs
 *      • Voir un utilisateur
 *      • Modifier un utilisateur
 *      • Supprimer un utilisateur
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const UserController = require("../controllers/UserController");
const { protect, restrictTo } = require("../middleware/auth");

/* =========================================================
   🔐 ROUTES UTILISATEUR (AUTHENTIFIÉ)
   ---------------------------------------------------------
   Ces routes sont accessibles à tous les utilisateurs
   authentifiés, peu importe leur rôle.
========================================================= */

router.use(protect); // toutes les routes ci-dessous nécessitent un JWT valide

// Voir son propre profil
router.get("/me", UserController.getMe);

// Mettre à jour son profil (email, username…)
router.patch("/update-me", UserController.updateMe);

// Modifier son mot de passe
router.patch("/update-password", UserController.updatePassword);

/* =========================================================
   🔐 ROUTES ADMIN STRICT
   ---------------------------------------------------------
   Admin uniquement : require protect + restrictTo("admin")
========================================================= */

router.use(restrictTo("admin"));

// Voir tous les utilisateurs
router.get("/", UserController.getUsers);

// Voir un utilisateur spécifique
router.get("/:id", UserController.getUser);

// Modifier un utilisateur (sauf mot de passe)
router.patch("/:id", UserController.updateUser);

// Supprimer un utilisateur
router.delete("/:id", UserController.deleteUser);

module.exports = router;
