const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.getUsers = catchAsync(async (req, res, next) => {
  // TODO: admin list users
});

exports.updateUserRole = catchAsync(async (req, res, next) => {
  // TODO: admin update user role
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  // TODO: admin delete user
});
