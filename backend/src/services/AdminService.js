/**
 * ---------------------------------------------------------
 * SERVICE : AdminService
 * ---------------------------------------------------------
 * - Contient TOUTE la logique métier du back-office
 * - Aucun req/res ici
 * - Stats avancées + gestion users, articles, reviews
 * ---------------------------------------------------------
 */

const User = require("../models/User");
const Article = require("../models/Article");
const Review = require("../models/Review");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const AppError = require("../utils/AppError");

class AdminService {

  // ---------------------------------------------------------
  // 📊 STATS DASHBOARD (version améliorée)
  // ---------------------------------------------------------
  static async getStats() {

    // --- Données simples ---
    const totalUsers = await User.countDocuments();
    const totalArticles = await Article.countDocuments();
    const publishedArticles = await Article.countDocuments({ status: "published" });
    const draftArticles = await Article.countDocuments({ status: "draft" });
    const totalReviews = await Review.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalTags = await Tag.countDocuments();

    // -----------------------------------------------------
    // Stats hiérarchie catégories
    // -----------------------------------------------------
    const rootCategories = await Category.countDocuments({ parent: null }); // OK
    const childCategories = totalCategories - rootCategories;               // OK

    const avgCategoryDepthAgg = await Category.aggregate([
      { $project: { depth: { $size: { $split: ["$path", " >"] } } } },
      { $group: { _id: null, avgDepth: { $avg: "$depth" } } }
    ]);

    const avgCategoryDepth = avgCategoryDepthAgg.length 
      ? avgCategoryDepthAgg[0].avgDepth 
      : 0; // FIX : renvoyer 0 si aucune catégorie

    // -----------------------------------------------------
    // Top catégories (article count) + POPULATE
    // -----------------------------------------------------
    const rawTopCategories = await Article.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topCategories = await Category.populate(rawTopCategories, {
      path: "_id",
      select: "name slug"
    }); // FIX : renvoyer name + slug

    // -----------------------------------------------------
    // Top tags + POPULATE
    // -----------------------------------------------------
    const rawTopTags = await Article.aggregate([
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topTags = await Tag.populate(rawTopTags, {
      path: "_id",
      select: "name slug"
    }); // FIX : renvoyer name + slug

    // -----------------------------------------------------
    // Top articles par vues (déjà bon)
    // -----------------------------------------------------
    const topArticles = await Article.find()
      .sort({ views: -1 })
      .limit(5)
      .select("title views slug");

    return {
      // --- Users / Articles / Reviews ---
      totalUsers,
      totalArticles,
      publishedArticles,
      draftArticles,
      totalReviews,

      // --- Categories / Tags ---
      totalCategories,
      rootCategories,
      childCategories,
      avgCategoryDepth,       // FIX appliqué
      totalTags,

      // --- Top content ---
      topCategories,          // FIX avec populate
      topTags,                // FIX avec populate
      topArticles
    };
  }

  // ---------------------------------------------------------
  // 👥 USERS
  // ---------------------------------------------------------
  static async getUsers() {
    return await User.find().select("-password");
  }

  static async getUser(id) {
    const user = await User.findById(id).select("-password");
    if (!user) throw new AppError("Utilisateur introuvable", 404);
    return user;
  }

  static async updateUser(id, body) {

    // -----------------------------------------------------
    // FIX : empêcher la modification du rôle
    // -----------------------------------------------------
    if (body.role) {
      delete body.role; // FIX
    }

    const user = await User.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) throw new AppError("Utilisateur introuvable", 404);
    return user;
  }

  static async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new AppError("Utilisateur introuvable", 404);
  }

  // ---------------------------------------------------------
  // 📝 ARTICLES
  // ---------------------------------------------------------
  static async getArticles() {
    return await Article.find()
      .populate("author", "username")
      .populate("category", "name")
      .populate("tags", "name");
  }

  static async getArticle(id) {
    const article = await Article.findById(id)
      .populate("author", "username")
      .populate("category", "name")
      .populate("tags", "name");

    if (!article) throw new AppError("Article introuvable", 404);
    return article;
  }

  static async updateArticle(id, body) {
    const article = await Article.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );

    if (!article) throw new AppError("Article introuvable", 404);
    return article;
  }

  static async deleteArticle(id) {
    const article = await Article.findById(id);
    if (!article) throw new AppError("Article introuvable", 404);

    await article.deleteOne(); // Cascade OK via hook ArticleModel
  }

  // ---------------------------------------------------------
  // 💬 REVIEWS
  // ---------------------------------------------------------
  static async getReviews() {
    return await Review.find()
      .sort({ createdAt: -1 })
      .populate("author", "username")
      .populate("article", "title slug");
  }

  static async deleteReview(id) {
    const review = await Review.findById(id);
    if (!review) throw new AppError("Commentaire introuvable", 404);

    await review.deleteOne();
  }
}

module.exports = AdminService;
