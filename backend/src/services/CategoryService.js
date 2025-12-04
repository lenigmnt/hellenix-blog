/**
 * ---------------------------------------------------------
 *  SERVICE : CategoryService
 * ---------------------------------------------------------
 *  Contient toute la logique métier :
 *   - CRUD catégories
 *   - Pas de req/res ici
 *   - Le controller appelle uniquement ces méthodes
 *   - Hiérarchie (parent) rajouté
 * ---------------------------------------------------------
 */

const Category = require("../models/Category");
const AppError = require("../utils/AppError");

class CategoryService {

  // CREATE (add parent)
  static async createCategory({name, parent}) {
    if (!name) {
      throw new AppError("Le nom de la catégorie est obligatoire", 400);
    }
    if (parent) {
        const exists = await Category.findById(parent);
        if (!exists) throw new AppError("Catégorie parente introuvable", 404);
    }
    return await Category.create({ name, parent }); // inclure parent
  }

  // GET ALL
  static async getCategories() {
    return await Category.find().sort("name").populate("parent", "name slug"); // populate parent
  }

  // GET ONE
  static async getCategory(id) {
    const category = await Category.findById(id).populate("parent", "name slug");
    if (!category) throw new AppError("Catégorie introuvable", 404);
    return category;
  }

  // UPDATE
  static async updateCategory(id, { name, parent }) {
    if (parent) {
        const exists = await Category.findById(parent);
        if (!exists) throw new AppError("Catégorie parente introuvable ")

    }
    const category = await Category.findByIdAndUpdate(
      id,
      { name, parent }, // <- add parent
      { new: true, runValidators: true }
    ).populate("parent", "name slug");
    if (!category) throw new AppError("Catégorie introuvable", 404);
    return category;
  }

  // DELETE
  static async deleteCategory(id) {
    const category = await Category.findByIdAndDelete(id);
    if (!category) throw new AppError("Catégorie introuvable", 404);
    return category;
  }
}

module.exports = CategoryService;
