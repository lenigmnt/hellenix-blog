// src/services/articleService.js
import api from "./api";

/**
 * Service Article
 * ----------------
 * Centralise tous les appels API liés aux articles.
 *
 * RÈGLES :
 * - Le service retourne TOUJOURS des données métier
 * - Le status (draft / published) est géré UNIQUEMENT
 *   par la route /articles/:id/publish
 */

const articleService = {
  /**
   * 🔓 Articles publics (status = published)
   * GET /api/articles
   */
  getAll: async () => {
    const res = await api.get("/articles");
    return res.data.data.articles;
  },

  /**
   * 🔓 Lecture d’un article
   * GET /api/articles/:id
   */
  getById: async (id) => {
    const res = await api.get(`/articles/${id}`);
    return res.data.data.article;
  },

  /**
   * 🔐 Articles de l'utilisateur connecté (draft + published)
   * GET /api/articles/me
   */
  getMine: async () => {
    const res = await api.get("/articles/me");
    return res.data.data.articles;
  },

  /**
   * 🔐 Création d’un article (toujours en draft)
   * POST /api/articles
   */
  create: async (data) => {
    const res = await api.post("/articles", data);
    return res.data.data.article;
  },

  /**
   * 🔐 Modification d’un article
   * ⚠️ NE JAMAIS passer "status" ici
   * PATCH /api/articles/:id
   */
  update: async (id, data) => {
    const res = await api.patch(`/articles/${id}`, data);
    return res.data.data.article;
  },

  /**
   * 🔐 Publication d’un article
   * PATCH /api/articles/:id/publish
   */
  publish: async (id) => {
    const res = await api.patch(`/articles/${id}/publish`);
    return res.data.data.article;
  },

  /**
   * 🔐 Suppression d’un article
   * DELETE /api/articles/:id
   */
  remove: async (id) => {
    await api.delete(`/articles/${id}`);
  },
};

export default articleService;
