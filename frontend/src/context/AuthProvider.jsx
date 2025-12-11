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
   * user       → informations de l'utilisateur connecté (null = non connecté)
   * loading    → true pendant la vérification auto du token (auto-login)
   * authError  → stockage centralisé des erreurs liées à l'auth
   */
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  /**
   * AUTO-LOGIN AU CHARGEMENT DE L'APP
   * --------------------------------
   * Au montage du composant, on vérifie si un token existe dans localStorage.
   * Si oui → on tente d'appeler GET /me pour récupérer les infos user.
   * Si non → on arrête directement le loading.
   *
   * Objectif : maintenir la session même après un refresh navigateur.
   */
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Aucun token → pas de session → on arrête juste la phase de chargement
    if (!token) {
      setLoading(false);
      return;
    }

    /**
     * Fonction interne async (bonne pratique car useEffect ne doit pas être async)
     */
    const init = async () => {
      try {
        // Vérifie le token en appelant l'API : GET /auth/me
        const res = await authService.getMe();
        setUser(res.data.user);     // On met à jour l'utilisateur connecté
        setAuthError(null);         // Aucun message d'erreur
      } catch (err) {
        /**
         * Si l'API renvoie une erreur :
         * - Token invalide ou expiré → on nettoie tout
         * - On renvoie un message compréhensible à l'utilisateur
         */
        console.error("Error on auto-login:", err);

        localStorage.removeItem("token");
        setUser(null);
        setAuthError("Session expirée. Veuillez vous reconnecter.");
      } finally {
        // Quoi qu'il arrive → on termine le chargement
        setLoading(false);
      }
    };

    init();
  }, []);

  /**
   * CONNEXION (LOGIN)
   * ------------------
   * Appelle POST /auth/login
   * → Stocke le token
   * → Met à jour l'utilisateur
   * → Gère les erreurs renvoyées par l'API
   */
  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });

      // On stocke le token pour maintenir la session
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      setAuthError(null);
    } catch (err) {
      console.error("Login failed:", err);

      // On extrait un message d'erreur précis si dispo
      setAuthError(
        err?.response?.data?.message ||
          "Échec de la connexion. Vérifiez vos identifiants."
      );

      // On renvoie l’erreur au composant Login pour qu’il puisse réagir
      throw err;
    }
  };

  /**
   * INSCRIPTION (REGISTER)
   * -----------------------
   * Appelle POST /auth/register
   * → Même logique que login mais avec création de compte
   */
  const register = async (name, email, password) => {
    try {
      const res = await authService.register({ name, email, password });

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
   * DÉCONNEXION (LOGOUT)
   * ---------------------
   * → Supprime le token
   * → Efface les infos utilisateur
   * → Réinitialise les erreurs
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAuthError(null);
  };

  /**
   * On expose via AuthContext toutes les valeurs utiles.
   * Chaque composant peut les récupérer via useAuth().
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
