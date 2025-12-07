/**
 * ---------------------------------------------------------
 *  MODEL : Category
 * ---------------------------------------------------------
 *  - Slug auto basé sur name
 *  - Hiérarchie infinie via parent
 *  - Path généré proprement : "Histoire > Grèce > Archaïque"
 *  - Virtual level : profondeur dans l'arborescence
 * ---------------------------------------------------------
 */

const mongoose = require("mongoose");
const slugify = require("slugify");

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Le nom de la catégorie est obligatoire"],
      unique: true,
      trim: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    // ---------------------------------------------------------
    // HIÉRARCHIE (parent)
    // ---------------------------------------------------------
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null
    },

    // ---------------------------------------------------------
    // PATH COMPLET (ex : "Histoire > Grèce > Archaïque")
    // ---------------------------------------------------------
    path: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true,

    // FIX : indispensable pour exposer level + path dans API
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ---------------------------------------------------------
   HOOK : slug + path
   ---------------------------------------------------------
   - Le slug est recalculé si name change
   - Le path est reconstruit en fonction du parent
--------------------------------------------------------- */
categorySchema.pre("save", async function () {

  // ---------------------------------------------------------
  // SLUG (toujours recalculé si name modifié)
  // ---------------------------------------------------------
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true }); // FIX
  }

  // ---------------------------------------------------------
  // PATH HIÉRARCHIQUE
  // ---------------------------------------------------------
  if (!this.parent) {
    // Catégorie racine
    this.path = this.name;
  } else {
    // Sous-catégorie
    const parentCategory = await this.constructor.findById(this.parent);

    if (parentCategory) {
      this.path = `${parentCategory.path} > ${this.name}`; // FIX
    }
  }
});

/* ---------------------------------------------------------
   VIRTUAL : level
   - 0 → racine
   - 1 → sous-catégorie
   - 2 → sous-sous-catégorie
--------------------------------------------------------- */
categorySchema.virtual("level").get(function () {
  if (!this.path) return 0;
  return this.path.split(" > ").length - 1;
});

module.exports = mongoose.model("Category", categorySchema);
