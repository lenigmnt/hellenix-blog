import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

/**
 * RequireAuth
 * -------------
 * Composant de protection des routes côté frontend.
 *
 * Rôle :
 * - Vérifie si l'utilisateur est authentifié
 * - Attend la fin de l'auto-login (loading)
 * - Redirige vers /login si non connecté
 * - Autorise l'accès si user existe
 *
 * Utilisation :
 * <RequireAuth>
 *   <PageProtégée />
 * </RequireAuth>
 */

export default function RequireAuth({ children }) {

    const { user, loading } = useAuth();
    const location = useLocation();


    // TANT QUE l'auth n'est pas résolue
    if (loading) {
        return <p>Chargement...</p>
    }

    // Utilisateur NON connecté = redirection vers login
    if (!user) {
        return (
            <Navigate
            to="/login"
            replace
            state= {{ from: location }}
            />
        );
    }
     // Utilisateur connecté = accès autorisé
    return children;

}