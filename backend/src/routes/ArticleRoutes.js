/**
 * =========================================================
 *  ROUTES : ArticleRoutes
 * ---------------------------------------------------------
 *  - Routes publiques : liste + lecture article
 *  - Routes protégées : création, édition, suppression
 *  - Route spéciale : /me → articles personnels
 *
 *  📌 Architecture MVC :
 *      Route → Controller → Service → Model
 *
 *  ⚠️ Important :
 *      La route /me doit être placée AVANT "/:id"
 *      pour éviter "Cast to ObjectId" lorsque l'URL = /me
 * =========================================================
 */

const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/ArticleController");
const { protect } = require("../middleware/auth");

/* =========================================================
   🔓 PUBLIC ROUTES
========================================================= */

// Liste des articles publiés (avec filtres)
router.get("/", ArticleController.getAllArticles);

/* =========================================================
   🔐 PROTECTED ROUTES
========================================================= */
router.use(protect);

/**
 * GET /api/articles/me
 * → Articles de l’utilisateur connecté
 *   - ?status=draft
 *   - ?status=published
 *   - ?status=all (default)
 *
 * ⚠️ Doit être AVANT "/:id"
 */
router.get("/me", ArticleController.getMyArticles);

// Créer un article
router.post("/", ArticleController.createArticle);

// Mettre à jour un article
router.patch("/:id", ArticleController.updateArticle);

// Supprimer un article
router.delete("/:id", ArticleController.deleteArticle);

// Publier un article
router.patch("/:id/publish", ArticleController.publishArticle);

/* =========================================================
   🔓 PUBLIC ROUTE
   (placée après les routes privées pour éviter conflit /me)
========================================================= */

// Lire un article par ID
router.get("/:id", ArticleController.getArticle);

module.exports = router;
