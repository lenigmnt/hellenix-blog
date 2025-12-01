/**
 * ---------------------------------------------------------
 *  CONTROLLER : CategoryController
 * ---------------------------------------------------------
 *  - Utilise CategoryService
 *  - Ne gère que req/res
 *  - Code minimal et propre
 * ---------------------------------------------------------
 */
const CategoryService = require("../services/CategoryService");
const catchAsync = require("../utils/catchAsync");

// GET ALL
exports.getCategories = catchAsync(async (req, res, next) => {
  const categories = await CategoryService.getCategories();
  res.status(200).json({
    status: "success",
    results: categories.length,
    data: { categories }
  });
});

// GET ONE
exports.getCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.getCategory(req.params.id);
  res.status(200).json({
    status: "success",
    data: { category }
  });
});

// CREATE
exports.createCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.createCategory(req.body.name);
  res.status(201).json({
    status: "success",
    data: { category }
  });
});

// UPDATE
exports.updateCategory = catchAsync(async (req, res, next) => {
  const category = await CategoryService.updateCategory(
    req.params.id,
    req.body.name
  );
  res.status(200).json({
    status: "success",
    data: { category }
  });
});

// DELETE
exports.deleteCategory = catchAsync(async (req, res, next) => {
  await CategoryService.deleteCategory(req.params.id);
  res.status(204).json({
    status: "success",
    data: null
  });
});
