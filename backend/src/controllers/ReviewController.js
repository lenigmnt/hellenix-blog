// ---------------------------------------------------------
// CONTROLLER : ReviewController
// ---------------------------------------------------------
// Rôle :
//   - Gère la réception des requêtes HTTP concernant les reviews
//   - Ne contient AUCUNE logique métier : délègue tout au ReviewService
//   - Retourne toujours une réponse JSON propre et normalisée
//   - catchAsync permet de capturer les erreurs async automatiquement
// ---------------------------------------------------------

const ReviewService = require("../services/ReviewService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/* =========================================================
   CREATE REVIEW
   ---------------------------------------------------------
   Route : POST /api/articles/:articleId/reviews
   Accès : User authentifié
   - Crée un commentaire lié à un article publié
   - L’auteur est automatiquement celui du token
   ========================================================= */
exports.createReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.createReview({
    content: req.body.content,
    articleId: req.params.articleId,
    authorId: req.user._id
  });

  res.status(201).json({
    status: "success",
    data: { review }
  });
});

/* =========================================================
   GET REVIEWS OF AN ARTICLE
   ---------------------------------------------------------
   Route : GET /api/articles/:articleId/reviews
   Accès : Public
   - Récupère tous les commentaires d’un article
   - Triés par date décroissante
   - Populate : auteur + article
   ========================================================= */
exports.getReviewsByArticle = catchAsync(async (req, res, next) => {
  const reviews = await ReviewService.getReviewsByArticle(req.params.articleId);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews }
  });
});

/* =========================================================
   UPDATE REVIEW
   ---------------------------------------------------------
   Route : PATCH /api/reviews/:id
   Accès : User authentifié + auteur uniquement
   - Un utilisateur peut modifier UNIQUEMENT son propre commentaire
   - Le service gère la vérification d’autorisation
   ========================================================= */
exports.updateReview = catchAsync(async (req, res, next) => {
  const review = await ReviewService.updateReview(
    req.params.id,
    req.user._id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { review }
  });
});

/* =========================================================
   DELETE REVIEW
   ---------------------------------------------------------
   Route : DELETE /api/reviews/:id
   Accès : User authentifié + (auteur OU admin)
   - L’auteur peut supprimer son commentaire
   - L’admin peut supprimer n’importe lequel
   ========================================================= */
exports.deleteReview = catchAsync(async (req, res, next) => {
  await ReviewService.deleteReview(req.params.id, req.user);

  res.status(204).json({
    status: "success",
    data: null
  });
});
