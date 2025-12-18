import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticleForm from "../components/articles/ArticleForm";
import articleService from "../services/articleService";

export default function CreateArticle() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreate = async (data) => {
    try {
      setLoading(true);
      setError(null);

      await articleService.create(data);

      // Après création → dashboard auteur
      navigate("/my-articles");
    } catch (err) {
      console.error(err);
      setError("Impossible de créer l’article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Nouvel article</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ArticleForm onSubmit={handleCreate} loading={loading} />
    </div>
  );
}
