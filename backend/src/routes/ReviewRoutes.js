/**
 * ---------------------------------------------------------
 * ROUTES : ReviewRoutes
 * ---------------------------------------------------------
 * - mergeParams: true → permet de récupérer :articleId
 *   depuis la route parent (/articles/:articleId/reviews)
 * - Les reviews sont publiques en lecture
 * - Toutes les actions d’écriture/modification
 *   sont protégées (token JWT requis)
 * - Les permissions (auteur / admin) sont gérées
 *   dans ReviewService → séparation propre des responsabilités
 * ---------------------------------------------------------
 */

const express = require("express");
const router = express.Router({ mergeParams: true });

const ReviewController = require("../controllers/ReviewController");
const { protect } = require("../middleware/auth");

/* ---------------------------------------------------------
   PUBLIC : Lire les commentaires d’un article
   ---------------------------------------------------------
   - Accessible sans connexion
   - Retourne toutes les reviews du même article
--------------------------------------------------------- */
router.get("/", ReviewController.getReviewsByArticle);

/* ---------------------------------------------------------
   PROTECTED : Créer un commentaire
   ---------------------------------------------------------
   - Utilisateur connecté seulement
   - authorId = req.user.id
   - articleId = req.params.articleId (depuis route parent)
--------------------------------------------------------- */
router.post("/", protect, ReviewController.createReview);

/* ---------------------------------------------------------
   PROTECTED : Modifier un commentaire
   ---------------------------------------------------------
   - Utilisateur connecté
   - Vérification auteur dans ReviewService
--------------------------------------------------------- */
router.patch("/:id", protect, ReviewController.updateReview);

/* ---------------------------------------------------------
   PROTECTED : Supprimer un commentaire
   ---------------------------------------------------------
   - Utilisateur connecté
   - Vérification auteur OU admin dans ReviewService
--------------------------------------------------------- */
router.delete("/:id", protect, ReviewController.deleteReview);

module.exports = router;
