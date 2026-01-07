// src/components/articles/ArticleForm.jsx
import { useEffect, useState } from "react";
import categoryService from "../../services/categoryService";

/**
 * ArticleForm
 * -----------
 * Formulaire réutilisable pour :
 * - Création d'article
 * - Édition d'article
 *
 * Props :
 * - onSubmit(data)
 * - loading (bool)
 * - initialValues (optionnel, pour Edit)
 */
export default function ArticleForm({
  onSubmit,
  loading = false,
  initialValues = null,
}) {
  // ===============================
  // STATES (initialisés UNE FOIS)
  // ===============================
  const [title, setTitle] = useState(initialValues?.title || "");
  const [content, setContent] = useState(initialValues?.content || "");
  const [category, setCategory] = useState(
    typeof initialValues?.category === "string"
      ? initialValues.category
      : initialValues?.category?._id || ""
  );

  const [categories, setCategories] = useState([]);

  // ===============================
  // FETCH CATEGORIES (EXTERNE)
  // ===============================
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (err) {
        console.error("Erreur chargement catégories :", err);
      }
    };

    fetchCategories();
  }, []);

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      title,
      content,
      category, // ObjectId valide
      tags: [], // MVP
    });
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Titre</label>
        <br />
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Contenu</label>
        <br />
        <textarea
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Catégorie</label>
        <br />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">-- Choisir --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Enregistrement..." : "Sauvegarder"}
      </button>
    </form>
  );
}
