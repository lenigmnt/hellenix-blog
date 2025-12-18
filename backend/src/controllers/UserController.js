/**
 * ---------------------------------------------------------
 *  CONTROLLER : UserController
 * ---------------------------------------------------------
 *  - Reçoit les req/res
 *  - Appelle UserService
 *  - catchAsync capture les erreurs async
 * ---------------------------------------------------------
 */

const UserService = require("../services/UserService");
const catchAsync = require("../utils/catchAsync");

/* =========================================================
   🔐 USER ROUTES (AUTH REQUIRED)
========================================================= */

// Voir son propre profil
exports.getMe = catchAsync(async (req, res) => {
  const user = await UserService.getMe(req.user.id);

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

// Modifier son profil
exports.updateMe = catchAsync(async (req, res) => {
  const user = await UserService.updateMe(req.user.id, req.body);

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

// Modifier son mot de passe
exports.updatePassword = catchAsync(async (req, res) => {
  const token = await UserService.updatePassword(
    req.user.id,
    req.body.currentPassword,
    req.body.newPassword
  );

  res.status(200).json({
    status: "success",
    message: "Mot de passe mis à jour",
    token
  });
});

/* =========================================================
   🔐 ADMIN ROUTES
========================================================= */

exports.getUsers = catchAsync(async (req, res) => {
  const users = await UserService.getUsers();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
});

exports.getUser = catchAsync(async (req, res) => {
  const user = await UserService.getUser(req.params.id);

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

exports.updateUser = catchAsync(async (req, res) => {
  const user = await UserService.updateUser(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    data: { user }
  });
});

exports.deleteUser = catchAsync(async (req, res) => {
  await UserService.deleteUser(req.params.id);

  res.status(204).json({
    status: "success",
    data: null
  });
});
