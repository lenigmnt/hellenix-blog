// src/pages/EditArticle.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import articleService from "../services/articleService";
import ArticleForm from "../components/articles/ArticleForm";

/**
 * Page EditArticle
 * ----------------
 * - Charge l’article existant (PRIVATE)
 * - Pré-remplit le formulaire
 * - Sauvegarde les modifications
 *
 * ⚠️ IMPORTANT :
 * Utilise OBLIGATOIREMENT la route :
 *   GET /api/articles/:id/edit
 * pour accéder aux drafts
 */
export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =====================================================
     LOAD ARTICLE FOR EDIT (PRIVATE)
  ===================================================== */
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleService.getForEdit(id); // ✅ ROUTE PRIVÉE
        setArticle(data);
      } catch (err) {
        console.error("❌ Erreur chargement article (edit) :", err);
        setError("Impossible de charger l’article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  /* =====================================================
     UPDATE
  ===================================================== */
  const handleUpdate = async (formData) => {
    try {
      await articleService.update(id, formData);
      navigate("/my-articles", { replace: true });
    } catch (err) {
      console.error("❌ Erreur mise à jour :", err);
      setError("Impossible de mettre à jour l’article");
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;
  if (!article) return null;

  return (
    <div>
      <h1>Modifier l’article</h1>

      <ArticleForm
        initialValues={article}
        onSubmit={handleUpdate}
        submitLabel="Sauvegarder"
      />
    </div>
  );
}
