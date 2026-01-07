// src/components/layout/Header.jsx
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="site-header">
      <div className="site-header-inner">
        {/* LEFT */}
        <Link to="/" className="site-logo">
          Hellenix
        </Link>

        {/* RIGHT */}
        <nav className="site-nav">
          {!user && (
            <>
              <Link to="/login">Connexion</Link>
              <Link to="/register">Inscription</Link>
            </>
          )}

          {user && (
            <>

              <Link to="/my-articles">Mes articles</Link>
              <Link to="/profile">Profil</Link>

              <button
                onClick={logout}
                className="secondary logout-button">
                Déconnexion
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
