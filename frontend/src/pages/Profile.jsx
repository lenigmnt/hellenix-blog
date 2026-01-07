// src/pages/Profile.jsx
import useAuth from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null; // sécurité (RequireAuth gère déjà)

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div>
      <h1>Mon profil</h1>

      <p>
        <strong>Username :</strong> {user.username}
      </p>

      <p>
        <strong>Email :</strong> {user.email}
      </p>

      {user.role && (
        <p>
          <strong>Rôle :</strong> {user.role}
        </p>
      )}

      <hr />

      <Link to="/my-articles">Voir mes articles</Link>

      <br /><br />

      <button onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
}
