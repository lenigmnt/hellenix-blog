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
    // AJOUTÉ : parent
    // -----------------------------------------------------
    // - Permet d'avoir une catégorie parente
    // - null = catégorie racine
    // - Une catégorie peut avoir 0, 1 ou plusieurs enfants
    // -----------------------------------------------------

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null // <-- pour la hiérarchie
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
  // Ne régénère pas le slug si le nom n'a pas changé
  if (!this.isModified("name")) return;

  this.slug = slugify(this.name, { lower: true, strict: true });
});

module.exports = mongoose.model("Category", categorySchema);
