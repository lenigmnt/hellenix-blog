/**
 * =========================================================
 *  CONTROLLER : ArticleController
 * ---------------------------------------------------------
 *  - Reçoit req/res depuis Express
 *  - Appelle ArticleService pour la logique métier
 *  - Formate les réponses JSON
 *  - Utilise catchAsync pour éviter les try/catch répétitifs
 *
 *  📌 Aucune logique métier ici (service uniquement)
 * =========================================================
 */

const ArticleService = require("../services/ArticleService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/* =========================================================
   CREATE ARTICLE (POST /api/articles)
========================================================= */
exports.createArticle = catchAsync(async (req, res, next) => {

  const article = await ArticleService.createArticle({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags,
    coverImage: req.body.coverImage,
    authorId: req.user._id
  });

  res.status(201).json({
    status: "success",
    data: { article }
  });
});

/* =========================================================
   GET ALL ARTICLES (GET /api/articles)
========================================================= */
exports.getAllArticles = catchAsync(async (req, res, next) => {

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const articles = await ArticleService.getAllArticles({
    category: req.query.category,
    tag: req.query.tag,
    search: req.query.search,
    page,
    limit
  });

  res.status(200).json({
    status: "success",
    results: articles.length,
    data: { articles }
  });
});

/* =========================================================
   GET SINGLE ARTICLE (GET /api/articles/:id)
========================================================= */
exports.getArticle = catchAsync(async (req, res, next) => {

  const article = await ArticleService.getArticle(req.params.id);

  if (!article) return next(new AppError("Article introuvable", 404));

  res.status(200).json({
    status: "success",
    data: { article }
  });
});

/* =========================================================
   GET MY ARTICLES (GET /api/articles/me)
========================================================= */
exports.getMyArticles = catchAsync(async (req, res, next) => {

  const status = req.query.status || "all"; // published, draft, all

  const articles = await ArticleService.getMyArticles(req.user._id, status);

  res.status(200).json({
    status: "success",
    filter: status,
    results: articles.length,
    data: { articles }
  });
});

/* =========================================================
   UPDATE ARTICLE (PATCH /api/articles/:id)
========================================================= */
exports.updateArticle = catchAsync(async (req, res, next) => {

  const article = await ArticleService.updateArticle(
    req.params.id,
    req.user._id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { article }
  });
});

/* =========================================================
   DELETE ARTICLE (DELETE /api/articles/:id)
========================================================= */
exports.deleteArticle = catchAsync(async (req, res, next) => {

  await ArticleService.deleteArticle(req.params.id, req.user);

  res.status(204).json({
    status: "success",
    data: null
  });
});

/* =========================================================
   PUBLISH ARTICLE (PATCH /api/articles/:id/publish)
========================================================= */
exports.publishArticle = catchAsync(async (req, res, next) => {

  const article = await ArticleService.publishArticle(
    req.params.id,
    req.user._id
  );

  res.status(200).json({
    status: "success",
    data: { article }
  });
});
