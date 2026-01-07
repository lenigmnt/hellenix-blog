/**
 * =========================================================
 *  ROUTES : ArticleRoutes
 * =========================================================
 */

const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/ArticleController");
const { protect } = require("../middleware/auth");

/* =========================================================
   🔓 PUBLIC ROUTES
========================================================= */

// ➤ Liste des articles publiés
router.get("/", ArticleController.getAllArticles);

// ➤ Articles de l’utilisateur connecté
router.get("/me", protect, ArticleController.getMyArticles);

/* =========================================================
   🔐 PROTECTED ROUTES (EDIT / CRUD)
========================================================= */

// ➤ Récupérer un article pour édition (draft + published)
router.get(
  "/:id/edit",
  protect,
  ArticleController.getArticleForEdit
);

// ➤ Créer un article
router.post("/", protect, ArticleController.createArticle);

// ➤ Modifier un article
router.patch("/:id", protect, ArticleController.updateArticle);

// ➤ Supprimer un article
router.delete("/:id", protect, ArticleController.deleteArticle);

// ➤ Publier un article
router.patch("/:id/publish", protect, ArticleController.publishArticle);

/* =========================================================
   🔓 PUBLIC READ (TOUJOURS EN DERNIER)
========================================================= */

// ➤ Lecture publique d’un article
router.get("/:id", ArticleController.getArticle);

module.exports = router;
