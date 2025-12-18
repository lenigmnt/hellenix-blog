// src/pages/Home.jsx
import { useEffect, useState } from "react";
import articleService from "../services/articleService";
import ArticleList from "../components/articles/ArticleList";

/**
 * Page Home
 * ---------
 * Affiche la liste des articles publics (status = published)
 * Accessible aux visiteurs non connectés
 */
export default function Home() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // ✅ articleService.getAll() retourne DIRECTEMENT un tableau d'articles
        const articles = await articleService.getAll();
        setArticles(articles);
        setError(null);
      } catch (err) {
        console.error("Erreur chargement articles :", err);
        setError("Impossible de charger les articles");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <p>Chargement des articles…</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Articles récents</h1>
      <ArticleList articles={articles} />
    </div>
  );
}
