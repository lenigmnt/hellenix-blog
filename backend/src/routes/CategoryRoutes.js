/**
 * ---------------------------------------------------------
 * ROUTES : CategoryRoutes
 * ---------------------------------------------------------
 * - CRUD des catégories du blog
 * - Lecture : public
 * - Création / édition / suppression : admin uniquement
 * - protect → nécessite un JWT valide
 * - restrictTo("admin") → autorisation stricte
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router();

const CategoryController = require("../controllers/CategoryController");
const { protect, restrictTo } = require("../middleware/auth");

// ==============================
// PUBLIC : liste des catégories
// ==============================
router.get("/", CategoryController.getCategories);
router.get("/:id", CategoryController.getCategory); // <-- ajout GET one category

// ==============================
// ADMIN : create / update / delete
// ==============================
router.post("/", protect, restrictTo("admin"), CategoryController.createCategory);

router.patch("/:id", protect, restrictTo("admin"), CategoryController.updateCategory);

router.delete("/:id", protect, restrictTo("admin"), CategoryController.deleteCategory);

module.exports = router;
