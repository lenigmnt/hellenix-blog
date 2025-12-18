// src/pages/MyArticles.jsx
import { useEffect, useState } from "react";
import articleService from "../services/articleService";
import MyArticleList from "../components/articles/MyArticleList";

/**
 * Page MyArticles
 * ----------------
 * Affiche la liste des articles de l'utilisateur connecté :
 * - drafts + published
 * - page protégée par RequireAuth
 */
export default function MyArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Chargement des articles personnels
   */
  const fetchMyArticles = async () => {
    try {
      setLoading(true);

      // ✅ articleService.getMine() retourne DIRECTEMENT un tableau d'articles
      const articles = await articleService.getMine();
      setArticles(articles);
      setError(null);
    } catch (err) {
      console.error("Erreur chargement mes articles :", err);
      setError("Impossible de charger vos articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArticles();
  }, []);

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Mes articles</h1>

      <MyArticleList
        articles={articles}
        onRefresh={fetchMyArticles}
      />
    </div>
  );
}
