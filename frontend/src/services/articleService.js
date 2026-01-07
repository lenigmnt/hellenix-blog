// src/services/articleService.js
import api from "./api";

/**
 * =========================================================
 * Service Article
 * =========================================================
 *
 * RÈGLES :
 * - Lecture publique ≠ édition
 * - Les drafts ne sont JAMAIS accessibles via getById
 * - L’édition utilise /articles/:id/edit
 */

const articleService = {
  /* =====================================================
     🔓 ARTICLES PUBLICS (PUBLISHED)
  ===================================================== */
  getAll: async (params = {}) => {
    const res = await api.get("/articles", { params });

    return {
      articles: Array.isArray(res.data?.data?.articles)
        ? res.data.data.articles
        : [],
      page: res.data?.page ?? 1,
      limit: res.data?.limit ?? 10,
      total: res.data?.total ?? 0,
      totalPages: res.data?.totalPages ?? 1,
    };
  },

  /* =====================================================
     🔓 LECTURE PUBLIQUE
     ⚠️ NE PAS utiliser pour éditer
  ===================================================== */
  getById: async (id) => {
    const res = await api.get(`/articles/${id}`);
    return res.data.data.article;
  },

  /* =====================================================
     🔐 ARTICLE POUR ÉDITION (PRIVATE)
     ✔ drafts + published
     ✔ auteur uniquement
  ===================================================== */
  getForEdit: async (id) => {
    const res = await api.get(`/articles/${id}/edit`);
    return res.data.data.article;
  },

  /* =====================================================
     🔐 ARTICLES DE L’UTILISATEUR
  ===================================================== */
  getMine: async (params = {}) => {
    const res = await api.get("/articles/me", { params });

    return {
      articles: res.data.data.articles,
      page: res.data.page,
      limit: res.data.limit,
      total: res.data.total,
      totalPages: res.data.totalPages,
    };
  },

  /* =====================================================
     🔐 CREATE (DRAFT)
  ===================================================== */
  create: async (data) => {
    const res = await api.post("/articles", data);
    return res.data.data.article;
  },

  /* =====================================================
     🔐 UPDATE (SANS STATUS)
  ===================================================== */
  update: async (id, data) => {
    const res = await api.patch(`/articles/${id}`, data);
    return res.data.data.article;
  },

  /* =====================================================
     🔐 PUBLISH
  ===================================================== */
  publish: async (id) => {
    const res = await api.patch(`/articles/${id}/publish`);
    return res.data.data.article;
  },

  /* =====================================================
     🔐 DELETE
  ===================================================== */
  remove: async (id) => {
    await api.delete(`/articles/${id}`);
  },
};

export default articleService;
