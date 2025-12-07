/**
 * ---------------------------------------------------------
 *  SERVICE : UserService
 * ---------------------------------------------------------
 *  - Contient toute la logique métier liée aux utilisateurs
 *  - Jamais de req/res ici
 *  - Utilisé par UserController uniquement
 * ---------------------------------------------------------
 */

const User = require("../models/User");
const AppError = require("../utils/AppError");
const generateToken = require("../utils/generateToken");

class UserService {

  /* =========================================================
     GET MY PROFILE
  ========================================================= */
  static async getMe(userId) {
    const user = await User.findById(userId);

    if (!user) throw new AppError("Utilisateur introuvable", 404);

    return user;
  }

  /* =========================================================
     UPDATE MY PROFILE (username / email / avatar)
  ========================================================= */
  static async updateMe(userId, body) {
    const allowed = ["username", "email", "avatar"];
    const updates = {};

    allowed.forEach(field => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true
    });

    if (!user) throw new AppError("Utilisateur introuvable", 404);

    return user;
  }

  /* =========================================================
     UPDATE PASSWORD
     - Vérifie currentPassword
     - Hash auto via pre-save
     - Renvoie un nouveau JWT
  ========================================================= */
  static async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select("+password");

    if (!user) throw new AppError("Utilisateur introuvable", 404);

    const isCorrect = await user.comparePassword(
      currentPassword,
      user.password
    );

    if (!isCorrect)
      throw new AppError("Mot de passe actuel incorrect", 401);

    user.password = newPassword;
    await user.save(); // trigger le pré-save hash

    // renvoyer un NOUVEAU TOKEN
    return generateToken(user._id);
  }

  /* =========================================================
     ADMIN : GET ALL USERS
  ========================================================= */
  static async getUsers() {
    return await User.find().sort("username");
  }

  /* =========================================================
     ADMIN : GET ONE USER
  ========================================================= */
  static async getUser(id) {
    const user = await User.findById(id);
    if (!user) throw new AppError("Utilisateur introuvable", 404);
    return user;
  }

  /* =========================================================
     ADMIN : UPDATE USER (role, email, username)
  ========================================================= */
  static async updateUser(id, body) {
    const allowed = ["username", "email", "avatar", "role"];
    const updates = {};

    allowed.forEach(field => {
      if (body[field] !== undefined) updates[field] = body[field];
    });

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    if (!user) throw new AppError("Utilisateur introuvable", 404);

    return user;
  }

  /* =========================================================
     ADMIN : DELETE USER
  ========================================================= */
  static async deleteUser(id) {
    const user = await User.findByIdAndDelete(id);

    if (!user) throw new AppError("Utilisateur introuvable", 404);
  }
}

module.exports = UserService;
