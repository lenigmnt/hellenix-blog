/**
 * ---------------------------------------------------------
 * CONTROLLER : AdminController
 * ---------------------------------------------------------
 * - Réceptionne les req/res
 * - Délègue la logique au AdminService
 * - Réponses JSON homogènes
 * ---------------------------------------------------------
 */

const AdminService = require("../services/AdminService.js");
const catchAsync = require("../utils/catchAsync");

// ---------------------------------------------------------
// 📊 STATS DASHBOARD
// ---------------------------------------------------------
exports.getStats = catchAsync(async (req, res, next) => {
  const stats = await AdminService.getStats();

  res.status(200).json({
    status: "success",
    data: stats
  });
});

// ---------------------------------------------------------
// 👥 USERS MANAGEMENT
// ---------------------------------------------------------
exports.getUsers = catchAsync(async (req, res, next) => {
  const users = await AdminService.getUsers();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await AdminService.getUser(req.params.id);

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  const user = await AdminService.updateUser(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await AdminService.deleteUser(req.params.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});

// ---------------------------------------------------------
// 📝 ARTICLES MANAGEMENT
// ---------------------------------------------------------
exports.getArticles = catchAsync(async (req, res, next) => {
  const articles = await AdminService.getArticles();

  res.status(200).json({
    status: "success",
    results: articles.length,
    data: { articles }
  });
});

exports.getArticle = catchAsync(async (req, res, next) => {
  const article = await AdminService.getArticle(req.params.id);

  res.status(200).json({
    status: "success",
    data: { article }
  });
});

exports.updateArticle = catchAsync(async (req, res, next) => {
  const article = await AdminService.updateArticle(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { article }
  });
});

exports.deleteArticle = catchAsync(async (req, res, next) => {
  await AdminService.deleteArticle(req.params.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});

// ---------------------------------------------------------
// 💬 REVIEWS MANAGEMENT
// ---------------------------------------------------------
exports.getReviews = catchAsync(async (req, res, next) => {
  const reviews = await AdminService.getReviews();

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: { reviews }
  });
});

exports.deleteReview = catchAsync(async (req, res, next) => {
  await AdminService.deleteReview(req.params.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});
