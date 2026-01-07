/**
 * =========================================================
 *  CONTROLLER : ArticleController
 * =========================================================
 */

const ArticleService = require("../services/ArticleService");
const catchAsync = require("../utils/catchAsync");

/**
 * ---------------------------------------------------------
 * CREATE ARTICLE (PRIVATE)
 * ---------------------------------------------------------
 */
exports.createArticle = catchAsync(async (req, res) => {
  const article = await ArticleService.createArticle({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags,
    coverImage: req.body.coverImage,
    authorId: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: { article },
  });
});

/**
 * ---------------------------------------------------------
 * GET ALL ARTICLES (PUBLIC - published only)
 * ---------------------------------------------------------
 */
exports.getAllArticles = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const { articles, total } = await ArticleService.getAllArticles({
    category: req.query.category,
    tag: req.query.tag,
    search: req.query.search,
    page,
    limit,
  });

  res.status(200).json({
    status: "success",
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    results: articles.length,
    data: { articles },
  });
});

/**
 * ---------------------------------------------------------
 * GET ONE ARTICLE (PUBLIC READ)
 * - protection draft dans le SERVICE
 * - incrément des vues ici
 * ---------------------------------------------------------
 */
exports.getArticle = catchAsync(async (req, res) => {
  const article = await ArticleService.getArticle(
    req.params.id,
    req.user || null
  );

  /* 👁️ increment views (SAFE) */
  const isPublished = article.status === "published";
  const userId = req.user?._id || req.user?.id;
  const authorId = article.author?._id;

  const isAuthor =
    userId && authorId && userId.toString() === authorId.toString();

  const isAdmin = req.user?.role === "admin";

  if (isPublished && !isAuthor && !isAdmin) {
    article.views += 1;
    await article.save({ validateBeforeSave: false });
  }

  res.status(200).json({
    status: "success",
    data: { article },
  });
});

/**
 * ---------------------------------------------------------
 * GET ARTICLE FOR EDIT (PRIVATE)
 * - auteur uniquement
 * - drafts + published
 * ---------------------------------------------------------
 */
exports.getArticleForEdit = catchAsync(async (req, res) => {
  const article = await ArticleService.getArticleForEdit(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    data: { article },
  });
});

/**
 * ---------------------------------------------------------
 * GET MY ARTICLES (PRIVATE)
 * ---------------------------------------------------------
 */
exports.getMyArticles = catchAsync(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const status = req.query.status || "all";

  const { articles, total } = await ArticleService.getMyArticles(
    req.user.id,
    status,
    page,
    limit
  );

  res.status(200).json({
    status: "success",
    filter: status,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    results: articles.length,
    data: { articles },
  });
});

/**
 * ---------------------------------------------------------
 * UPDATE ARTICLE (PRIVATE)
 * ---------------------------------------------------------
 */
exports.updateArticle = catchAsync(async (req, res) => {
  const article = await ArticleService.updateArticle(
    req.params.id,
    req.user.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { article },
  });
});

/**
 * ---------------------------------------------------------
 * DELETE ARTICLE (PRIVATE)
 * ---------------------------------------------------------
 */
exports.deleteArticle = catchAsync(async (req, res) => {
  await ArticleService.deleteArticle(req.params.id, req.user);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

/**
 * ---------------------------------------------------------
 * PUBLISH ARTICLE (PRIVATE)
 * ---------------------------------------------------------
 */
exports.publishArticle = catchAsync(async (req, res) => {
  const article = await ArticleService.publishArticle(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    data: { article },
  });
});
