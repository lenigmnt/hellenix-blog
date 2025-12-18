// src/components/articles/MyArticleRow.jsx
import { Link } from "react-router-dom";
import articleService from "../../services/articleService";

/**
 * Ligne d’article dans "Mes articles"
 * ----------------------------------
 * - Modifier
 * - Publier
 * - Supprimer
 *
 * Le status est géré UNIQUEMENT par la route /publish
 */
export default function MyArticleRow({ article, onRefresh }) {
  const isPublished = article.status === "published";

  /**
   * Publication de l’article
   * → Le backend empêche de republier
   */
  const handlePublish = async () => {
    try {
      await articleService.publish(article._id);
      onRefresh();
    } catch (err) {
      console.error("Erreur publication :", err);
    }
  };

  /**
   * Suppression de l’article
   */
  const handleDelete = async () => {
    if (!window.confirm("Supprimer cet article ?")) return;

    try {
      await articleService.remove(article._id);
      onRefresh();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  return (
    <tr>
      <td>{article.title}</td>
      <td>{isPublished ? "Publié" : "Brouillon"}</td>
      <td>
        <Link to={`/articles/${article._id}/edit`}>Modifier</Link>{" "}
        {!isPublished && (
          <button onClick={handlePublish}>Publier</button>
        )}{" "}
        <button onClick={handleDelete}>Supprimer</button>
      </td>
    </tr>
  );
}
