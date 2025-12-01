/**
 * ---------------------------------------------------------
 *  MODEL : Tag
 *  ---------------------------------------------------------
 *  - Génère automatiquement un slug basé sur le nom
 *  - Aligne la logique sur Category.js et Article.js
 *  - Utilise un hook async sans next() (recommandation moderne)
 * ---------------------------------------------------------
 */

const mongoose = require("mongoose");
const slugify = require("slugify");

const tagSchema = new mongoose.Schema(
  {
    /** Nom du tag
     * - Obligatoire
     * - Unique (évite doublons)
     * - trim : nettoie espaces inutiles
     */
    name: {
      type: String,
      required: [true, "Le nom du tag est obligatoire"],
      unique: true,
      trim: true
    },

    /** Slug généré automatiquement
     * - Toujours en minuscule
     * - Utilisé dans les filtres/URL
     */
    slug: {
      type: String,
      unique: true,
      lowercase: true
    }
  },

  {
    timestamps: true
  }
);

/* ---------------------------------------------------------
   HOOK : Génération automatique du slug avant sauvegarde
   ---------------------------------------------------------
   - Se déclenche uniquement si "name" change
   - Remplace espaces / caractères spéciaux
   - Exemple : "Intelligence Artificielle"
     -> "intelligence-artificielle"
--------------------------------------------------------- */
tagSchema.pre("save", async function () {
  if (!this.isModified("name")) return;

  this.slug = slugify(this.name, { lower: true, strict: true });
});

module.exports = mongoose.model("Tag", tagSchema);
