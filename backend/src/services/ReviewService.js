const Review = require("../models/Review");
const Article = require("../models/Article");
const AppError = require("../utils/AppError");

class ReviewService {

  /* ============================================================
     CREATE REVIEW
  ============================================================ */
  static async createReview({ content, articleId, authorId }) {

    if (!content || content.trim().length < 5) {
      throw new AppError("Le commentaire doit contenir au moins 5 caractères", 400);
    }

    const article = await Article.findById(articleId);

    if (!article) throw new AppError("Article introuvable", 404);

    // Empêcher commentaire sur brouillon
    if (article.status !== "published") {
      throw new AppError("Impossible de commenter un brouillon", 400);
    }

    const review = await Review.create({
      content,
      article: articleId,
      author: authorId
    });

    return await review.populate("author", "username avatar");
  }

  /* ============================================================
     GET REVIEWS OF AN ARTICLE
  ============================================================ */
  static async getReviewsByArticle(articleId, user = null) {

    const article = await Article.findById(articleId);

    if (!article) throw new AppError("Article introuvable", 404);

    // Si article draft → seuls auteur ou admin peuvent voir commentaires
    if (article.status === "draft") {
      if (!user) throw new AppError("Article introuvable", 404);

      const isAuthor = article.author.toString() === user._id.toString();
      const isAdmin = user.role === "admin";

      if (!isAuthor && !isAdmin) {
        throw new AppError("Article introuvable", 404);
      }
    }

    return await Review.find({ article: articleId })
      .sort({ createdAt: -1 })
      .populate("author", "username avatar")
      .populate("article", "title slug");
  }

  /* ============================================================
     UPDATE REVIEW (AUTHOR ONLY)
  ============================================================ */
  static async updateReview(reviewId, userId, body) {
    const review = await Review.findById(reviewId);

    if (!review) throw new AppError("Commentaire introuvable", 404);

    if (review.author.toString() !== userId.toString()) {
      throw new AppError("Non autorisé", 403);
    }

    if (!body.content || body.content.trim().length < 5) {
      throw new AppError("Le commentaire doit contenir au moins 5 caractères", 400);
    }

    review.content = body.content;

    await review.save();

    return await review.populate("author", "username avatar");
  }

  /* ============================================================
     DELETE REVIEW (AUTHOR OR ADMIN)
  ============================================================ */
  static async deleteReview(reviewId, user) {
    const review = await Review.findById(reviewId);

    if (!review) throw new AppError("Commentaire introuvable", 404);

    const isAuthor = review.author.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new AppError("Non autorisé", 403);
    }

    await review.deleteOne();
  }
}

module.exports = ReviewService;
