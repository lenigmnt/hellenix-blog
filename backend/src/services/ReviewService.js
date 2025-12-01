// ---------------------------------------------------------
// SERVICE : ReviewService
// ---------------------------------------------------------
// - Contient toute la logique métier des commentaires
// - Le controller ne fait qu’appeler ces méthodes
// - Jamais de req/res ici !
// - populate utilisé pour renvoyer des données enrichies
// ---------------------------------------------------------

const Review = require("../models/Review");
const Article = require("../models/Article");
const AppError = require("../utils/AppError");

class ReviewService {

  // -------------------------------------------------------
  // CREATE REVIEW
  // -------------------------------------------------------
  static async createReview({ content, articleId, authorId }) {
    // Vérifier si l’article existe ET est publié
    const article = await Article.findById(articleId);

    if (!article) throw new AppError("Article introuvable", 404);
    if (article.status !== "published")
      throw new AppError("Impossible de commenter un brouillon", 400);

    // Création du commentaire
    const review = await Review.create({
      content,
      article: articleId,
      author: authorId
    });

    // populate pour renvoyer un résultat complet
    return await review.populate("author", "username avatar");
  }

  // -------------------------------------------------------
  // GET REVIEWS OF ARTICLE
  // -------------------------------------------------------
  static async getReviewsByArticle(articleId) {
    return await Review.find({ article: articleId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .populate("article", "title slug");
  }

  // -------------------------------------------------------
  // UPDATE REVIEW (author only)
  // -------------------------------------------------------
  static async updateReview(reviewId, userId, body) {
    const review = await Review.findById(reviewId);

    if (!review) throw new AppError("Commentaire introuvable", 404);
    if (review.author.toString() !== userId.toString())
      throw new AppError("Non autorisé", 403);

    review.content = body.content ?? review.content;

    await review.save();

    return await review.populate("author", "username avatar");
  }

  // -------------------------------------------------------
  // DELETE REVIEW (author or admin)
  // -------------------------------------------------------
  static async deleteReview(reviewId, user) {
    const review = await Review.findById(reviewId);

    if (!review) throw new AppError("Commentaire introuvable", 404);

    const isAuthor = review.author.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin)
      throw new AppError("Non autorisé", 403);

    await review.deleteOne();
  }
}

module.exports = ReviewService;
