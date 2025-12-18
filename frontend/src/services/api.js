// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // ✅ JWT en header, pas cookies
});

/**
 * INTERCEPTOR REQUEST
 * -------------------
 * Ajoute automatiquement le token JWT dans le header Authorization
 */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/**
 * INTERCEPTOR RESPONSE
 * --------------------
 * Gestion globale des erreurs API
 * → AUCUNE navigation ici
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }

    return Promise.reject(error);
  }
);

export default api;
