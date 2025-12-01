/**
 * ---------------------------------------------------------
 *  SERVICE : CategoryService
 * ---------------------------------------------------------
 *  Contient toute la logique métier :
 *   - CRUD catégories
 *   - Pas de req/res ici
 *   - Le controller appelle uniquement ces méthodes
 * ---------------------------------------------------------
 */

const Category = require("../models/Category");
const AppError = require("../utils/AppError");

class CategoryService {

  // CREATE
  static async createCategory(name) {
    if (!name) {
      throw new AppError("Le nom de la catégorie est obligatoire", 400);
    }
    return await Category.create({ name });
  }

  // GET ALL
  static async getCategories() {
    return await Category.find().sort("name");
  }

  // GET ONE
  static async getCategory(id) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Catégorie introuvable", 404);
    return category;
  }

  // UPDATE
  static async updateCategory(id, name) {
    const category = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
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
