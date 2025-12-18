/**
 * =========================================================
 *  CONTROLLER : ArticleController (corrigé)
 * =========================================================
 */

const ArticleService = require("../services/ArticleService");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

exports.createArticle = catchAsync(async (req, res, next) => {
  const article = await ArticleService.createArticle({
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    tags: req.body.tags,
    coverImage: req.body.coverImage,
    authorId: req.user.id
  });

  res.status(201).json({
    status: "success",
    data: { article }
  });
});

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

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await ArticleService.getArticle(
    req.params.id,
    req.user || null
  );

  res.status(200).json({
    status: "success",
    data: { article }
  });
});

exports.getMyArticles = catchAsync(async (req, res, next) => {
  const status = req.query.status || "all";

  const articles = await ArticleService.getMyArticles(req.user.id, status);

  res.status(200).json({
    status: "success",
    filter: status,
    results: articles.length,
    data: { articles }
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await ArticleService.updateArticle(
    req.params.id,
    req.user.id,
    req.body
  );

  res.status(200).json({
    status: "success",
    data: { article }
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  await ArticleService.deleteArticle(req.params.id, req.user);

  res.status(204).json({
    status: "success",
    data: null
  });
});

exports.publishArticle = catchAsync(async (req, res, next) => {
  const article = await ArticleService.publishArticle(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    status: "success",
    data: { article }
  });
});
