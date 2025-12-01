/**
 * ---------------------------------------------------------
 * MODEL : Review (Commentaire)
 * ---------------------------------------------------------
 * - Chaîné à un article + un auteur
 * - Sert pour les commentaires sous un article
 * - timestamps : createdAt / updatedAt automatiques
 * - Conçu pour être utilisé avec ReviewService
 * ---------------------------------------------------------
 */

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    /**
     * -----------------------------------------------------
     * CONTENT : Contenu du commentaire
     * -----------------------------------------------------
     * - Minimum 3 caractères
     * - Champ obligatoire
     */
    content: {
      type: String,
      required: [true, "Le contenu est obligatoire"],
      minlength: [3, "Le commentaire doit contenir au moins 3 caractères"]
    },

    /**
     * -----------------------------------------------------
     * ARTICLE : Référence vers l’article concerné
     * -----------------------------------------------------
     * - Relation MANY → ONE
     * - Populate dans ReviewService
     */
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Article",
      required: [true, "Un article est requis pour créer un commentaire"]
    },

    /**
     * -----------------------------------------------------
     * AUTHOR : Utilisateur ayant écrit le commentaire
     * -----------------------------------------------------
     * - Relation MANY → ONE
     * - Populate dans ReviewService
     */
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    /**
     * -----------------------------------------------------
     * APPROVED : Commentaire validé automatiquement
     * -----------------------------------------------------
     * - Système prévu si tu ajoutes une modération
     */
    approved: {
      type: Boolean,
      default: true
    },

    /**
     * -----------------------------------------------------
     * REPORTED : Flag si un utilisateur signale un commentaire
     * -----------------------------------------------------
     * - Utile pour fonctionnalité bonus
     */
    reported: {
      type: Boolean,
      default: false
    }
  },

  {
    timestamps: true // createdAt + updatedAt
  }
);

module.exports = mongoose.model("Review", reviewSchema);
