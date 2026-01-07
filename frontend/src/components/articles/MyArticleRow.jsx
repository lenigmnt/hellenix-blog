import { Link } from "react-router-dom";
import articleService from "../../services/articleService";

/**
 * Ligne d’article dans "Mes articles"
 * ----------------------------------
 * - Statut (badge)
 * - Vues
 * - Reviews
 * - Modifier
 * - Publier
 * - Supprimer
 *
 * ⚠️ IMPORTANT :
 * - Un draft NE DOIT PAS pointer vers la lecture publique
 */
export default function MyArticleRow({ article, onRefresh }) {
  const isPublished = article.status === "published";

  /* =====================================================
     DEBUG (TEMPORAIRE)
  ===================================================== */
  // Décommente si besoin
  // console.log("🧩 MyArticleRow article =", {
  //   id: article._id,
  //   status: article.status,
  //   views: article.views,
  //   reviewCount: article.reviewCount,
  // });

  /* =====================================================
     ACTIONS
  ===================================================== */
  const handlePublish = async () => {
    try {
      await articleService.publish(article._id);
      onRefresh();
    } catch (err) {
      console.error("Erreur publication :", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cet article ?")) return;

    try {
      await articleService.remove(article._id);
      onRefresh();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  /* =====================================================
     LINKS
  ===================================================== */
  const articleLink = isPublished
    ? `/articles/${article._id}`          // lecture publique
    : `/articles/${article._id}/edit`;    // édition draft (à modifier ou retirer ?? après)

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <tr>
      {/* 📝 TITRE */}
      <td>
        <Link
          to={articleLink}
          style={{ fontWeight: 600 }}
        >
          {article.title}
        </Link>
      </td>

      {/* 🏷️ STATUT */}
      <td style={{ textAlign: "center" }}>
        <span
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: "4px",
            fontSize: "0.8rem",
            fontWeight: 600,
            color: isPublished ? "#155724" : "#856404",
            backgroundColor: isPublished ? "#d4edda" : "#fff3cd",
          }}
        >
          {isPublished ? "Publié" : "Brouillon"}
        </span>
      </td>

      {/* 👁️ VUES */}
      <td style={{ textAlign: "center" }}>
        {article.views ?? 0}
      </td>

      {/* 💬 REVIEWS */}
      <td style={{ textAlign: "center" }}>
        {article.reviewCount ?? 0}
      </td>

      {/* ⚙️ ACTIONS */}
      <td>
        <Link to={`/articles/${article._id}/edit`}>
          Modifier
        </Link>{" "}
        {!isPublished && (
          <button onClick={handlePublish}>
            Publier
          </button>
        )}{" "}
        <button onClick={handleDelete}>
          Supprimer
        </button>
      </td>
    </tr>
  );
}
