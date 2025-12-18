/**
 * =========================================================
 *  ROUTES : ArticleRoutes
 * ---------------------------------------------------------
 *  - Routes publiques :
 *        • Liste des articles publiés
 *        • Lecture d’un article
 *
 *  - Routes protégées :
 *        • /me → articles personnels
 *        • Création, modification, suppression, publication
 *
 *  📌 Architecture MVC :
 *        Route → Controller → Service → Model
 *
 *  ⚠️ IMPORTANT :
 *      "/me" doit être placé AVANT "/:id"
 *      sinon Express interprète "me" comme un ObjectId
 *      et Mongoose renvoie : Cast to ObjectId failed
 *
 * =========================================================
 */

const express = require("express");
const router = express.Router();

const ArticleController = require("../controllers/ArticleController");
const { protect } = require("../middleware/auth");

/* =========================================================
   🔓 PUBLIC ROUTES
   ---------------------------------------------------------
   - Aucune authentification requise
========================================================= */

// ➤ Liste des articles publiés (avec filtres : category, tag, search)
router.get("/", ArticleController.getAllArticles);

/* 
 * ⚠️ Route "/me" DOIT être placée AVANT "/:id"
 *    sinon "/me" est interprété comme un paramètre ":id"
 *    et génère une erreur cast ObjectId.
 *
 * Comme "/me" est PROTÉGÉ, on applique protect ici,
 * mais SANS déplacer la route.
 */

// ➤ Articles de l’utilisateur connecté (protected)
router.get("/me", protect, ArticleController.getMyArticles);

// ➤ Lecture d’un article par ID (PUBLIC)
router.get("/:id", ArticleController.getArticle);

/* =========================================================
   🔐 PROTECTED ROUTES
   ---------------------------------------------------------
   - L’utilisateur doit être authentifié pour :
 *      • Créer un article
 *      • Modifier son propre article
 *      • Supprimer son article (ou admin)
 *      • Publier un article
========================================================= */

// ➤ Créer un article (author = req.user.id)
router.post("/", protect, ArticleController.createArticle);

// ➤ Modifier un article (auteur uniquement)
router.patch("/:id", protect, ArticleController.updateArticle);

// ➤ Supprimer un article (auteur ou admin)
router.delete("/:id", protect, ArticleController.deleteArticle);

// ➤ Publier un article (auteur uniquement)
router.patch("/:id/publish", protect, ArticleController.publishArticle);

module.exports = router;
