/**
 * ---------------------------------------------------------
 *  SERVICE : TagService
 * ---------------------------------------------------------
 *  - CRUD tags
 *  - Empêche doublons
 *  - Empêche suppression si tag utilisé
 *  - Slug toujours mis à jour ! (fix)
 * ---------------------------------------------------------
 */

const Tag = require("../models/Tag");
const Article = require("../models/Article");
const AppError = require("../utils/AppError");

class TagService {

  // -----------------------------------------------------
  // GET ALL TAGS
  // -----------------------------------------------------
  static async getTags() {
    return await Tag.find().sort("name");
  }

  // -----------------------------------------------------
  // GET ONE TAG
  // -----------------------------------------------------
  static async getTag(id) {
    const tag = await Tag.findById(id);
    if (!tag) throw new AppError("Tag introuvable", 404);
    return tag;
  }

  // -----------------------------------------------------
  // CREATE TAG
  // -----------------------------------------------------
  static async createTag(name) {
    if (!name) throw new AppError("Le nom du tag est obligatoire", 400);

    // Empêcher doublons logique (insensible à la casse)
    const existing = await Tag.findOne({ name: new RegExp("^" + name + "$", "i") });
    if (existing) {
      throw new AppError("Un tag portant ce nom existe déjà", 400);
    }

    return await Tag.create({ name });
  }

  // -----------------------------------------------------
  // UPDATE TAG
  // -----------------------------------------------------
  static async updateTag(id, name) {
    if (!name) throw new AppError("Le nom du tag est obligatoire", 400);

    const tag = await Tag.findById(id);
    if (!tag) throw new AppError("Tag introuvable", 404);

    // Empêcher conflit de nom (casse-insensible)
    const duplicate = await Tag.findOne({
      _id: { $ne: id },
      name: new RegExp("^" + name + "$", "i")
    });
    if (duplicate) {
      throw new AppError("Un autre tag porte déjà ce nom", 400);
    }

    tag.name = name;
    await tag.save(); // ⚠ déclenche le hook → slug mis à jour !

    return tag;
  }

  // -----------------------------------------------------
  // DELETE TAG
  // -----------------------------------------------------
  static async deleteTag(id) {
    const tag = await Tag.findById(id);
    if (!tag) throw new AppError("Tag introuvable", 404);

    // Empêcher suppression d’un tag utilisé dans des articles
    const used = await Article.findOne({ tags: id });
    if (used) {
      throw new AppError(
        "Impossible de supprimer ce tag car il est utilisé dans un ou plusieurs articles.",
        400
      );
    }

    await tag.deleteOne();
    return tag;
  }
}

module.exports = TagService;
