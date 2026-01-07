/**
 * ============================================================
 *  SERVICE : ArticleService
 * ============================================================
 */

const mongoose = require("mongoose");
const Article = require("../models/Article");
const Category = require("../models/Category");
const Tag = require("../models/Tag");
const AppError = require("../utils/AppError");

class ArticleService {

  /* ============================================================
     CREATE
  ============================================================ */
  static async createArticle({
    title,
    content,
    category,
    tags,
    coverImage,
    authorId,
  }) {
    console.log("🧠 [ArticleService] createArticle", {
      title,
      category,
      tags,
      authorId,
    });

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      console.log("❌ Catégorie invalide :", category);
      throw new AppError("Catégorie invalide", 400);
    }

    if (tags) {
      if (!Array.isArray(tags)) {
        throw new AppError("Tags doit être un tableau d'IDs", 400);
      }

      const tagsCount = await Tag.countDocuments({
        _id: { $in: tags },
      });

      if (tagsCount !== tags.length) {
        console.log("❌ Tags invalides :", tags);
        throw new AppError("Certains tags sont invalides", 400);
      }
    }

    const article = await Article.create({
      title,
      content,
      category,
      tags,
      coverImage,
      author: authorId,
    });

    console.log("✅ Article créé :", article._id);
    return article;
  }

  /* ============================================================
     GET LIST (PUBLIC – PAGINATED)
  ============================================================ */
  static async getAllArticles({ category, tag, search, page, limit }) {
    console.log("🧠 [ArticleService] getAllArticles", {
      category,
      tag,
      search,
      page,
      limit,
    });

    const filter = { status: "published" };

    if (category) {
      const selectedCategory = await Category.findById(category);
      if (selectedCategory) {
        const subCategories = await Category.find({
          path: { $regex: `^${selectedCategory.path}` },
        }).select("_id");

        filter.category = {
          $in: subCategories.map((c) => c._id),
        };
      }
    }

    if (tag) filter.tags = tag;

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [{ title: regex }, { content: regex }];
    }

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .populate("author", "username avatar")
      .populate("category", "name path")
      .populate("tags", "name")
      .populate("reviews", "_id");

    const total = await Article.countDocuments(filter);

    console.log(
      `📄 Articles trouvés : ${articles.length} / ${total}`
    );

    return { articles, total };
  }

  /* ============================================================
     GET SINGLE ARTICLE (PUBLIC)
  ============================================================ */
  static async getArticle(id, user = null) {
    console.log("🧠 [ArticleService] getArticle", {
      id,
      userId: user?._id || user?.id,
      role: user?.role,
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ ID invalide :", id);
      throw new AppError("Article introuvable", 404);
    }

    const article = await Article.findById(id)
      .populate("author", "username avatar role")
      .populate("category")
      .populate("tags")
      .populate({
        path: "reviews",
        populate: {
          path: "author",
          select: "username avatar",
        },
        options: { sort: { createdAt: -1 } },
      });

    if (!article) {
      console.log("❌ Article non trouvé en base");
      throw new AppError("Article introuvable", 404);
    }

    console.log("📄 Article trouvé :", {
      id: article._id,
      status: article.status,
      author: article.author?._id,
    });

    // 🔒 Protection draft
    if (article.status === "draft") {
      console.log("🔒 Article en draft");

      if (!user) {
        console.log("❌ Draft + user non connecté");
        throw new AppError("Article introuvable", 404);
      }

      const userId = user._id || user.id;
      const authorId = article.author?._id;

      const isAuthor =
        authorId && authorId.toString() === userId.toString();
      const isAdmin = user.role === "admin";

      console.log("🔎 Draft access check", {
        userId,
        authorId,
        isAuthor,
        isAdmin,
      });

      if (!isAuthor && !isAdmin) {
        console.log("❌ Accès draft refusé");
        throw new AppError("Article introuvable", 404);
      }
    }

    console.log("✅ Accès article autorisé");
    return article;
  }

  /* ============================================================
     GET ARTICLE FOR EDIT (PRIVATE)
  ============================================================ */
  static async getArticleForEdit(id, userId) {
    console.log("🧠 [ArticleService] getArticleForEdit", {
      id,
      userId,
    });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log("❌ ID invalide pour edit :", id);
      throw new AppError("Article introuvable", 404);
    }

    const article = await Article.findOne({
      _id: id,
      author: userId,
    })
      .populate("category")
      .populate("tags");

    if (!article) {
      console.log(
        "❌ Article non trouvé ou user non auteur",
        { id, userId }
      );
      throw new AppError("Article introuvable", 404);
    }

    console.log("✅ Article chargé pour édition :", article._id);
    return article;
  }

  /* ============================================================
     GET MY ARTICLES
  ============================================================ */
  static async getMyArticles(userId, status, page = 1, limit = 10) {
    console.log("🧠 [ArticleService] getMyArticles", {
      userId,
      status,
      page,
      limit,
    });

    const authorId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    const filter = { author: authorId };
    if (status === "draft") filter.status = "draft";
    if (status === "published") filter.status = "published";

    const skip = (page - 1) * limit;

    const articles = await Article.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("category", "name")
      .populate("tags", "name")
      .populate("reviews", "_id");

    const total = await Article.countDocuments(filter);

    console.log(`📄 Mes articles : ${articles.length} / ${total}`);
    return { articles, total };
  }

  /* ============================================================
     UPDATE
  ============================================================ */
  static async updateArticle(id, userId, data) {
    console.log("🧠 [ArticleService] updateArticle", {
      id,
      userId,
      fields: Object.keys(data),
    });

    const article = await Article.findById(id);
    if (!article) {
      console.log("❌ Article introuvable pour update");
      throw new AppError("Article introuvable", 404);
    }

    if (article.author.toString() !== userId.toString()) {
      console.log("❌ Update refusé : pas auteur");
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    if ("status" in data) delete data.status;

    const allowed = ["title", "content", "category", "tags", "coverImage"];
    allowed.forEach((field) => {
      if (data[field] !== undefined) {
        article[field] = data[field];
      }
    });

    await article.save();
    console.log("✅ Article mis à jour :", article._id);
    return article;
  }

  /* ============================================================
     DELETE
  ============================================================ */
  static async deleteArticle(id, user) {
    console.log("🧠 [ArticleService] deleteArticle", {
      id,
      userId: user._id,
      role: user.role,
    });

    const article = await Article.findById(id);
    if (!article) {
      throw new AppError("Article introuvable", 404);
    }

    const isAuthor = article.author.toString() === user._id.toString();
    const isAdmin = user.role === "admin";

    if (!isAuthor && !isAdmin) {
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    await article.deleteOne();
    console.log("🗑️ Article supprimé :", id);
  }

  /* ============================================================
     PUBLISH
  ============================================================ */
  static async publishArticle(id, userId) {
    console.log("🧠 [ArticleService] publishArticle", {
      id,
      userId,
    });

    const article = await Article.findById(id);
    if (!article) {
      throw new AppError("Article introuvable", 404);
    }

    if (article.author.toString() !== userId.toString()) {
      throw new AppError("Vous n’avez pas la permission", 403);
    }

    if (article.status === "published") {
      throw new AppError("Cet article est déjà publié", 400);
    }

    article.status = "published";
    await article.save();

    console.log("🚀 Article publié :", article._id);
    return article;
  }
}

module.exports = ArticleService;
