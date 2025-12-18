/**
 * AuthProvider.jsx
 * -----------------
 * Ce composant React encapsule toute la logique d’authentification de l’application.
 * Il expose :
 *   - user : l'utilisateur connecté
 *   - loading : indique si l'app vérifie une session existante
 *   - authError : message d'erreur global lié à l’authentification
 *   - login() / register() / logout() : fonctions pour manipuler la session
 *
 * Il utilise un Context (AuthContext) pour rendre ces valeurs disponibles
 * partout dans l'app via le hook personnalisé useAuth().
 *
 * Objectif : centraliser toute la gestion de l’auth dans un seul endroit,
 * au lieu de dupliquer la logique dans les composants Login / Register / Profile etc.
 */

import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import authService from "../services/authService";

export default function AuthProvider({ children }) {
  /**
   * user       → utilisateur connecté (null = non connecté)
   * loading    → true pendant la vérification auto du token
   * authError  → message d'erreur global lié à l’auth
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * AUTO-LOGIN
   * ----------
   * Au montage de l'app :
   * - si un token existe → appel GET /auth/me
   * - sinon → on sort immédiatement du loading
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const res = await authService.getMe();
        setUser(res.data.user);
        setAuthError(null);
      } catch (err) {
        console.error("Error on auto-login:", err);

        localStorage.removeItem("token");
        setUser(null);
        setAuthError("Session expirée. Veuillez vous reconnecter.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /**
   * LOGIN
   * -----
   * POST /auth/login
   */
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setAuthError(null);
    } catch (err) {
      console.error("Login failed:", err);

      setAuthError(
        err?.response?.data?.message ||
          "Échec de la connexion. Vérifiez vos identifiants."
      );

      throw err;
    }
  };

  /**
   * REGISTER
   * --------
   * POST /auth/register
   * ⚠️ Le backend attend : username / email / password
   */
  const register = async (username, email, password) => {
    try {
      const res = await authService.register({
        username,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setAuthError(null);
    } catch (err) {
      console.error("Register failed:", err);

      setAuthError(
        err?.response?.data?.message || "Impossible de créer le compte."
      );

      throw err;
    }
  };

  /**
   * LOGOUT
   * ------
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAuthError(null);
  };

  /**
   * Exposition du contexte
   */
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        authError,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
