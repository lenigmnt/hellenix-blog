/**
 * ---------------------------------------------------------
 *  SERVICE : TagService
 * ---------------------------------------------------------
 *  Contient toute la logique métier :
 *   - CRUD tags
 *   - Aucun Express ici
 * ---------------------------------------------------------
 */

const Tag = require("../models/Tag");
const AppError = require("../utils/AppError");

class TagService {

  static async getTags() {
    return await Tag.find().sort("name");
  }

  static async getTag(id) {
    const tag = await Tag.findById(id);
    if (!tag) throw new AppError("Tag introuvable", 404);
    return tag;
  }

  static async createTag(name) {
    if (!name) throw new AppError("Le nom du tag est obligatoire", 400);
    return await Tag.create({ name });
  }

  static async updateTag(id, name) {
    const tag = await Tag.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );
    if (!tag) throw new AppError("Tag introuvable", 404);
    return tag;
  }

  static async deleteTag(id) {
    const tag = await Tag.findByIdAndDelete(id);
    if (!tag) throw new AppError("Tag introuvable", 404);
    return tag;
  }
}

module.exports = TagService;
