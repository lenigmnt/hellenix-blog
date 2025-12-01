/**
 * =========================================================
 *  MODEL : Article
 *  Description : Structure complète des articles du blog.
 * 
 *  ➤ Champs principaux : titre, contenu, slug, image, statut
 *  ➤ Relations : auteur, catégorie, tags
 *  ➤ Métadonnées : vues, likes, ratings
 *  ➤ Fonctionnalités :
 *      - Génération automatique du slug
 *      - Méthodes d’instance (publish, incrementViews)
 *      - Méthode statique (findPublished)
 *      - Champ virtuel (readingTime)
 *  Les hooks utilisent un "pre-save" async
 * =========================================================
 */

console.log(">>> Article model loaded");

const mongoose = require("mongoose");
const slugify = require("slugify");

/**
 * =========================================================
 *  SCHEMA DEFINITION
 * =========================================================
 */
const articleSchema = new mongoose.Schema(
  {
    /* -------------------------------------------------------
       TITLE
       Titre lisible de l'article.
       - Trim supprime les espaces inutiles
       - Longueurs contrôlées
    ------------------------------------------------------- */
    title: {
      type: String,
      required: [true, "Le titre est obligatoire"],
      trim: true,
      minlength: [3, "Minimum 3 caractères"],
      maxlength: [150, "Maximum 150 caractères"],
    },

    /* -------------------------------------------------------
       SLUG
       Version URL-friendly du titre.
       - Généré automatiquement dans le hook pre-save
       - Toujours en minuscule
       - Unique pour éviter les conflits de route
    ------------------------------------------------------- */
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    /* -------------------------------------------------------
       CONTENT
       Contenu principal de l’article.
       - Longueur minimale pour garantir une vraie publication
    ------------------------------------------------------- */
    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      minlength: [20, "Minimum 20 caractères"],
    },

    /* -------------------------------------------------------
       COVER IMAGE
       Image principale (URL ou fichier).
       - Optionnelle
    ------------------------------------------------------- */
    coverImage: {
      type: String,
      default: null,
    },

    /* -------------------------------------------------------
       STATUS
       Statut de publication.
       - "draft" → non publié
       - "published" → visible publiquement
    ------------------------------------------------------- */
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    /* -------------------------------------------------------
       VIEWS
       Nombre total de vues.
       - Modifiable via incrementViews()
    ------------------------------------------------------- */
    views: {
      type: Number,
      default: 0,
      min: 0,
    },

    /* -------------------------------------------------------
       CATEGORY
       Référence obligatoire à une catégorie.
    ------------------------------------------------------- */
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "La catégorie est obligatoire"],
    },

    /* -------------------------------------------------------
       TAGS
       Liste de tags liés à l'article.
    ------------------------------------------------------- */
    tags: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tag",
      }
    ],

    /* -------------------------------------------------------
       AUTHOR
       Auteur de l'article (User)
    ------------------------------------------------------- */
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* -------------------------------------------------------
       METADATA
       Informations statistiques calculées via d’autres features. (like, rating)
    ------------------------------------------------------- */
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },

  /* ---------------------------------------------------------
     OPTIONS DU SCHEMA
     - timestamps : ajoute createdAt / updatedAt
     - virtuals : autorise les champs virtuels dans JSON/objet
  --------------------------------------------------------- */
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/**
 * =========================================================
 *  HOOK : pre-save
 *  Génère automatiquement un slug à partir du titre.
 *  - async utilisé 
 *  - Ne régénère pas le slug si le titre n'a pas été modifié
 * =========================================================
 */
articleSchema.pre("save", async function () {
  if (!this.isModified("title")) return;
  this.slug = slugify(this.title, { lower: true, strict: true });
});

/**
 * =========================================================
 *  INSTANCE METHODS
 * =========================================================
 */

/* ---------------------------------------------------------
   publish() = Passe l’article en "published" puis sauvegarde
--------------------------------------------------------- */
articleSchema.methods.publish = function () {
  this.status = "published";
  return this.save();
};

/* ---------------------------------------------------------
   incrementViews() = Incrémente le compteur de vues.
--------------------------------------------------------- */
articleSchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

/**
 * =========================================================
 *  STATIC METHODS
 *  Méthodes disponibles sur LE MODELE complet
 * =========================================================
 */

/* ---------------------------------------------------------
   findPublished()
   Retourne tous les articles publiés, triés par date récente.
--------------------------------------------------------- */
articleSchema.statics.findPublished = function () {
  return this.find({ status: "published" }).sort({ createdAt: -1 });
};

/**
 * =========================================================
 *  VIRTUAL FIELDS
 *  Propriétés dynamiques NON stockées en base
 * =========================================================
 */

/* ---------------------------------------------------------
   readingTime
   Estimation du temps de lecture :
   - Hypothèse : 200 mots par minute
--------------------------------------------------------- */
articleSchema.virtual("readingTime").get(function () {
  if (!this.content) return 1;
  const words = this.content.split(" ").length;
  return Math.ceil(words / 200);
});

/**
 * =========================================================
 *  EXPORT DU MODELE
 * =========================================================
 */
module.exports = mongoose.model("Article", articleSchema);
