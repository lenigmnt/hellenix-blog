// src/services/authService.js
import api from "./api";

/**
 * authService
 * -----------
 * Normalise les réponses backend Auth
 * pour que le reste du front soit propre.
 */

const authService = {
  /**
   * REGISTER
   * POST /auth/register
   * @returns { user, token }
   */
  register: async (payload) => {
    const res = await api.post("/auth/register", payload);

    return {
      user: res.data.data.user,
      token: res.data.token,
    };
  },

  /**
   * LOGIN
   * POST /auth/login
   * @returns { user, token }
   */
  login: async (payload) => {
    const res = await api.post("/auth/login", payload);

    return {
      user: res.data.data.user,
      token: res.data.token,
    };
  },

  /**
   * GET ME
   * GET /auth/me
   * @returns { user }
   */
  getMe: async () => {
    const res = await api.get("/auth/me");

    return {
      user: res.data.data.user,
    };
  },
};

export default authService;
