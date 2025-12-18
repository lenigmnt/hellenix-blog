// src/pages/EditArticle.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import articleService from "../services/articleService";
import ArticleForm from "../components/articles/ArticleForm";

/**
 * Page EditArticle
 * ----------------
 * - Charge l’article existant
 * - Pré-remplit le formulaire
 * - Sauvegarde les modifications
 */
export default function EditArticle() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charger l’article à modifier
   */
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await articleService.getById(id);
        setArticle(data);
      } catch (err) {
        console.error("Erreur chargement article :", err);
        setError("Impossible de charger l’article");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  /**
   * Sauvegarde des modifications
   */
  const handleUpdate = async (formData) => {
    try {
      await articleService.update(id, formData);
      navigate("/my-articles", { replace: true });
    } catch (err) {
      console.error("Erreur mise à jour :", err);
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
        submitLabel="Enregistrer les modifications"
      />
    </div>
  );
}
