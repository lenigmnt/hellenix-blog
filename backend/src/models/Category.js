/**
 * ---------------------------------------------------------
 *  MODEL : Category
 *  ---------------------------------------------------------
 *  - Génère automatiquement un slug à partir du nom
 *  - Garantit unicité + formattage propre
 *  - Utilise une logique cohérente avec User.js / Article.js
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

    // -----------------------------------------------------
    // AJOUTÉ : parent -> hiérachie infinie
    // -----------------------------------------------------
    // - Permet d'avoir une catégorie parente
    // - null = catégorie racine
    // - Une catégorie peut avoir 0, 1 ou plusieurs enfants
    // -----------------------------------------------------

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null // <-- pour la hiérarchie
    },
    // ----------------------------------------
    // AJOUTÉ : Path complet de la hiérarchie
    // Exemple : "Histoire ancienne > Grèce > Grèce archaïque"
    // ----------------------------------------
    path: {
      type: String,
      default: "" // <- add pour le virtual tree
    }
  },
    {
    timestamps: true
    }
);

/* ---------------------------------------------------------
   HOOK : Génération automatique du slug
   ---------------------------------------------------------
   - Exécuté avant sauvegarde (pre-save)
   - Se déclenche uniquement si "name" change
   - Même logique que pour Article.js (async sans next)
--------------------------------------------------------- */
categorySchema.pre("save", async function () {
  
  // Slug si le name change (CORRIGÉ)
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }

  // PATH hiérarchique (CORRIGÉ)
  if (!this.parent) {
    // Catégorie racine
    this.path = this.name;
  } else {
    // Sous-catégorie
    const parentCategory = await this.constructor.findById(this.parent);
    if (parentCategory) {
      this.path = `${parentCategory.path} > ${this.name}`;
    }
  }
});

/* ---------------------------------------------------------
   VIRTUAL : level (profondeur dans la hiérarchie)
   ---------------------------------------------------------
   - Calculée depuis "path"
   - level = 0 → racine
   - level = 1 → enfant
   - level = 2 → petit-enfant
   - etc.
--------------------------------------------------------- */
categorySchema.virtual("level").get(function () {
  if (!this.path) return 0;
  return this.path.split(" > ").length - 1; // add
});


module.exports = mongoose.model("Category", categorySchema);
