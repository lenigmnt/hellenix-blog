// src/context/AuthProvider.jsx
import { useState, useEffect, useRef } from "react";
import { AuthContext } from "./AuthContext";
import authService from "../services/authService";

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
// attention à bien gérer sinon erreur too many request de connexion
  const hasTriedAutoLogin = useRef(false);

  /**
   * AUTO-LOGIN   
   * ----------
   * Si un token existe :
   * → appel GET /auth/me
   * → hydrate le user
   *
   * ⚠️ IMPORTANT :
   * - NE PAS supprimer le token ici
   * - Sinon on casse toute la session
   */
  useEffect(() => {

    // empêche toute répétition (StrictMode inclus)
    if (hasTriedAutoLogin.current) return;
    hasTriedAutoLogin.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    const init = async () => {
      try {
        const { user } = await authService.getMe();
        setUser(user);
        setAuthError(null);
      } catch (err) {
        console.error("Auto-login failed:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  /**
   * LOGIN
   */
  const login = async (email, password) => {
    try {
      const { user, token } = await authService.login({ email, password });
      localStorage.setItem("token", token);
      setUser(user);
      setAuthError(null);
    } catch (err) {
      setAuthError(
        err?.response?.data?.message ||
          "Échec de la connexion. Vérifiez vos identifiants."
      );
      throw err;
    }
  };

  /**
   * REGISTER
   */
  const register = async (username, email, password) => {
    try {
      const { user, token } = await authService.register({
        username,
        email,
        password,
      });

      localStorage.setItem("token", token);
      setUser(user);
      setAuthError(null);
    } catch (err) {
      setAuthError(
        err?.response?.data?.message ||
          "Impossible de créer le compte."
      );
      throw err;
    }
  };

  /**
   * LOGOUT   
   * -------
   * SEUL ENDROIT où on supprime le token
   */
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setAuthError(null);
  };

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
