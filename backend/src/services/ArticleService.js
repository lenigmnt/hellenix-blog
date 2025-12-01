/**
 * ============================================================
 *  SERVICE : ArticleService
 *  ------------------------------------------------------------
 *  Rôle :
 *    - Contient toute la logique métier liée aux articles
 *    - Le controller appelle ce service
 *    - Le service interagit uniquement avec le modèle Article
 *    - Peut lever des AppError (gestion propre des erreurs)
 *
 *  📌 Architecture respectée :
 *      Route → Controller → Service → Model
 * ============================================================
 */

const Article = require("../models/Article");
const AppError = require("../utils/AppError");

class ArticleService {

  /* ============================================================
     CREATE ARTICLE
     ------------------------------------------------------------
     - Crée un nouvel article
     - L’auteur vient du JWT (req.user)
     - Le slug sera généré automatiquement (hook pre-save)
  ============================================================ */
  static async createArticle({ title, content, category, tags, coverImage, authorId }) {
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
     GET ALL ARTICLES (PUBLIC)
     ------------------------------------------------------------
     Retourne uniquement les articles publiés.
     Supporte :
       - ?category=ID
       - ?tag=ID
       - ?search=mot
       - pagination
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
      .populate("category")
      .populate("tags")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
  }

  /* ============================================================
     GET SINGLE ARTICLE
     ------------------------------------------------------------
     - Récupère un article (draft ou published)
     - Toujours avec populate
  ============================================================ */
  static async getArticle(id) {
    return await Article.findById(id)
      .populate("author", "username avatar")
      .populate("category")
      .populate("tags");
  }

  /* ============================================================
     GET MY ARTICLES (AUTHOR ONLY)
     ------------------------------------------------------------
     - Retourne les articles DE L’UTILISATEUR connecté
     - Supporte :
          ?status=published
          ?status=draft
          ?status=all (défaut)
     - Toujours triés du plus récent au plus ancien
  ============================================================ */
  static async getMyArticles(userId, status) {

    const query = { author: userId };

    if (status === "draft") query.status = "draft";
    if (status === "published") query.status = "published";
    // "all" = aucun filtre sur status

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

    const allowed = ["title", "content", "category", "tags", "coverImage", "status"];
    allowed.forEach(field => {
      if (data[field] !== undefined) article[field] = data[field];
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
     ------------------------------------------------------------
     - Auteur uniquement
  ============================================================ */
  static async publishArticle(id, userId) {
    const article = await Article.findById(id);
    if (!article) throw new AppError("Article introuvable", 404);

    if (article.author.toString() !== userId.toString()) {
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    article.status = "published";
    await article.save();
    return article;
  }
}

module.exports = ArticleService;
