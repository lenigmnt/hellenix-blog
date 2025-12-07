/**
 * ============================================================
 *  SERVICE : ArticleService (VERSION CORRIGÉE)
 * ============================================================
 */

const Article = require("../models/Article");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const AppError = require("../utils/AppError");

class ArticleService {

  /* ============================================================
     CREATE
  ============================================================ */
  static async createArticle({ title, content, category, tags, coverImage, authorId }) {

    // Vérification catégorie
    const categoryExists = await Category.findById(category);
    if (!categoryExists) throw new AppError("Catégorie invalide", 400);

    // Vérification tags
    if (tags) {
      if (!Array.isArray(tags)) {
        throw new AppError("Tags doit être un tableau d'IDs", 400);
      }

      const tagsCount = await Tag.countDocuments({ _id: { $in: tags } });
      if (tagsCount !== tags.length) {
        throw new AppError("Certains tags sont invalides", 400);
      }
    }

    return await Article.create({
      title,
      content,
      category,
      tags,
      coverImage,
      author: authorId
    });
  }

  /* ============================================================
     GET LIST (PUBLIC)
  ============================================================ */
  static async getAllArticles({ category, tag, search, page, limit }) {
    const query = { status: "published" };

    if (category) query.category = category;
    if (tag) query.tags = tag;

    if (search) {
      const regex = new RegExp(search, "i");
      query.$or = [{ title: regex }, { content: regex }];
    }

    const skip = (page - 1) * limit;

    return await Article.find(query)
      .populate("author", "username avatar")
      .populate("category", "name")
      .populate("tags", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  /* ============================================================
     GET SINGLE ARTICLE (PROTÉGÉ DRAFT)
  ============================================================ */
  static async getArticle(id, user = null) {
    const article = await Article.findById(id)
      .populate("author", "username avatar")
      .populate("category")
      .populate("tags");

    if (!article) throw new AppError("Article introuvable", 404);

    // Protection DRAFT : seul auteur/admin peut lire
    if (article.status === "draft") {
      if (!user) throw new AppError("Article introuvable", 404);
      const isAuthor = article.author._id.toString() === user._id.toString();
      const isAdmin = user.role === "admin";
      if (!isAuthor && !isAdmin) throw new AppError("Article introuvable", 404);
    }

    return article;
  }

  /* ============================================================
     GET MY ARTICLES (AUTHOR ONLY)
  ============================================================ */
  static async getMyArticles(userId, status) {
    const query = { author: userId };

    if (status === "draft") query.status = "draft";
    if (status === "published") query.status = "published";

    return await Article.find(query)
      .sort({ createdAt: -1 })
      .populate("category")
      .populate("tags");
  }

  /* ============================================================
     UPDATE ARTICLE (AUTHOR ONLY)
  ============================================================ */
  static async updateArticle(id, userId, data) {

    const article = await Article.findById(id);
    if (!article) throw new AppError("Article introuvable", 404);

    if (article.author.toString() !== userId.toString()) {
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    // Empêcher changement de status ici !
    if ("status" in data) delete data.status;

    // Vérification catégorie si modifiée
    if (data.category) {
      const exists = await Category.findById(data.category);
      if (!exists) throw new AppError("Catégorie invalide", 400);
    }

    // Vérification tags si modifiés
    if (data.tags) {
      if (!Array.isArray(data.tags)) {
        throw new AppError("Tags doit être un tableau d'IDs", 400);
      }
      const tagsCount = await Tag.countDocuments({ _id: { $in: data.tags } });
      if (tagsCount !== data.tags.length) {
        throw new AppError("Certains tags sont invalides", 400);
      }
    }

    const allowed = ["title", "content", "category", "tags", "coverImage"];
    allowed.forEach(field => {
      if (data[field] !== undefined) {
        article[field] = data[field];
      }
    });

    await article.save();
    return article;
  }

  /* ============================================================
     DELETE ARTICLE (AUTHOR OR ADMIN)
  ============================================================ */
  static async deleteArticle(id, user) {
    const article = await Article.findById(id);
    if (!article) throw new AppError("Article introuvable", 404);

    const isAuthor = article.author.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    await article.deleteOne();
  }

  /* ============================================================
     PUBLISH ARTICLE
  ============================================================ */
  static async publishArticle(id, userId) {
    const article = await Article.findById(id);
    if (!article) throw new AppError("Article introuvable", 404);

    if (article.author.toString() !== userId.toString()) {
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    if (article.status === "published") {
      throw new AppError("Cet article est déjà publié", 400);
    }

    article.status = "published";
    await article.save();
    return article;
  }
}

module.exports = ArticleService;
