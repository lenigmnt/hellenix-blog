// src/components/articles/MyArticleList.jsx
import { Link } from "react-router-dom";
import MyArticleRow from "./MyArticleRow";
import Button from "../ui/Button";

export default function MyArticleList({ articles, onRefresh }) {
  /* =====================================================
     EMPTY STATE
  ===================================================== */
  if (!Array.isArray(articles) || articles.length === 0) {
    return (
      <div style={{ marginTop: "2rem" }}>
        <p>Vous n’avez encore aucun article.</p>

        <Link to="/articles/new">
          <Button style={{ marginTop: "1rem" }}>
            Créer un article
          </Button>
        </Link>
      </div>
    );
  }

  /* =====================================================
     LISTE DES ARTICLES
  ===================================================== */
  return (
    <table style={{ width: "100%", marginTop: "1.5rem", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Titre</th>
          <th style={{ textAlign: "center" }}>Statut</th>
          <th style={{ textAlign: "center" }}>Vues</th>
          <th style={{ textAlign: "center" }}>Avis</th>
          <th style={{ textAlign: "left" }}>Actions</th>
        </tr>
      </thead>

      <tbody>
        {articles.map((article) => (
          <MyArticleRow
            key={article._id}
            article={article}
            onRefresh={onRefresh}
          />
        ))}
      </tbody>
    </table>
  );
}
