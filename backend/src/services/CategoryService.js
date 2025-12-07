/**
 * ---------------------------------------------------------
 *  SERVICE : CategoryService
 * ---------------------------------------------------------
 *  - CRUD catégories
 *  - Validation parent
 *  - Empêche les cycles
 *  - Hiérarchie complète (parent / path / level)
 *  - Empêche suppression d'une catégorie utilisée
 * ---------------------------------------------------------
 */

const Category = require("../models/Category");
const Article = require("../models/Article");
const AppError = require("../utils/AppError");

class CategoryService {

  // ---------------------------------------------------------
  // CREATE
  // ---------------------------------------------------------
  static async createCategory({ name, parent }) {
    if (!name) {
      throw new AppError("Le nom de la catégorie est obligatoire", 400);
    }

    // Vérifier si le parent existe
    if (parent) {
      const exists = await Category.findById(parent);
      if (!exists) throw new AppError("Catégorie parente introuvable", 404);
    }

    return await Category.create({ name, parent });
  }

  // ---------------------------------------------------------
  // GET ALL
  // ---------------------------------------------------------
  static async getCategories() {
    return await Category.find()
      .sort("path")
      .populate("parent", "name slug");
  }

  // ---------------------------------------------------------
  // GET ONE
  // ---------------------------------------------------------
  static async getCategory(id) {
    const category = await Category.findById(id)
      .populate("parent", "name slug");

    if (!category) throw new AppError("Catégorie introuvable", 404);
    return category;
  }

  // ---------------------------------------------------------
  // UPDATE
  // ---------------------------------------------------------
  static async updateCategory(id, { name, parent }) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Catégorie introuvable", 404);

    // 1. Une catégorie ne peut pas être son propre parent
    if (parent && parent.toString() === id.toString()) {
      throw new AppError("Une catégorie ne peut pas être son propre parent", 400);
    }

    // 2. Si un parent est donné → vérifier s'il existe
    if (parent !== undefined && parent !== null) {
      const exists = await Category.findById(parent);
      if (!exists) throw new AppError("Catégorie parente introuvable", 404);
    }

    // 3. Empêcher les cycles (A → B, B → A, etc.)
    if (parent) {
      let current = await Category.findById(parent);

      while (current) {
        if (current.id === id) {
          throw new AppError("Cycle détecté dans la hiérarchie des catégories", 400);
        }
        current = current.parent ? await Category.findById(current.parent) : null;
      }
    }

    // ---------------------------------------------------------
    // FIX : gérer correctement parent = null (rendre racine)
    // ---------------------------------------------------------
    if (name !== undefined) category.name = name;
    if (parent !== undefined) category.parent = parent; // null autorisé

    await category.save(); // recalcul path + slug via hook

    return await category.populate("parent", "name slug");
  }

  // ---------------------------------------------------------
  // DELETE
  // ---------------------------------------------------------
  static async deleteCategory(id) {
    const category = await Category.findById(id);
    if (!category) throw new AppError("Catégorie introuvable", 404);

    // 1. Empêcher suppression si enfants
    const children = await Category.find({ parent: id });
    if (children.length > 0) {
      throw new AppError(
        "Impossible de supprimer une catégorie ayant des sous-catégories.",
        400
      );
    }

    // 2. Empêcher suppression si utilisée par des articles
    const usedByArticle = await Article.findOne({ category: id });
    if (usedByArticle) {
      throw new AppError(
        "Impossible de supprimer cette catégorie car elle est utilisée par un ou plusieurs articles.",
        400
      );
    }

    // 3. Suppression autorisée
    await category.deleteOne();
    return category;
  }
}

module.exports = CategoryService;
