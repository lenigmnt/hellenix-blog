// src/services/reviewService.js
import api from "./api";

/**
 * Service Review
 * --------------
 * - Reviews = commentaires
 * - Liées à un article
 * - Lecture publique
 * - Création protégée
 *
 * MVP : PAS d’update / delete
 */

const reviewService = {
  /**
   * 🔓 Reviews d’un article
   * GET /api/articles/:id/reviews
   */
  getByArticle: async (articleId) => {
    const res = await api.get(`/articles/${articleId}/reviews`);
    return res.data.data.reviews;
  },

  /**
   * 🔐 Créer une review
   * POST /api/articles/:id/reviews
   */
  create: async (articleId, payload) => {
    const res = await api.post(
      `/articles/${articleId}/reviews`,
      payload
    );
    return res.data.data.review;
  },
};

export default reviewService;
