// src/pages/Login.jsx
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  const { user, loading } = useAuth();
  const location = useLocation();

  // ⏳ Tant que l'auth n'est PAS stabilisée
  if (loading) {
    return <p>Chargement...</p>;
  }

  // ✅ Auth stabilisée + user présent → redirection
  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from} replace />;
  }

  // ❌ Sinon → formulaire
  return (
    <div>
      <h1>Connexion</h1>
      <LoginForm />
    </div>
  );
}
