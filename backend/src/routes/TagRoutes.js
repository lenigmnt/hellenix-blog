/**
 * ---------------------------------------------------------
 * ROUTES : TagRoutes
 * ---------------------------------------------------------
 * - Gestion des tags du blog
 * - Public :
 *      • Liste des tags
 *      • Lecture d’un tag
 * - Admin :
 *      • Création, modification, suppression
 * - protect + restrictTo("admin") ⇒ sécurité stricte
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const TagController = require("../controllers/TagController");
const { protect, restrictTo } = require("../middleware/auth");

// ==============================
// PUBLIC ROUTES
// ==============================
router.get("/", TagController.getTags);
router.get("/:id", TagController.getTag);

// ==============================
// ADMIN ROUTES
// ==============================
router.post("/", protect, restrictTo("admin"), TagController.createTag);
router.patch("/:id", protect, restrictTo("admin"), TagController.updateTag);
router.delete("/:id", protect, restrictTo("admin"), TagController.deleteTag);

module.exports = router;
