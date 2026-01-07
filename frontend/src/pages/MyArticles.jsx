// src/pages/MyArticles.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import articleService from "../services/articleService";
import MyArticleList from "../components/articles/MyArticleList";
import Button from "../components/ui/Button";
import Pagination from "../components/ui/Pagination";

/**
 * Page MyArticles
 * ----------------
 * - Liste des articles de l'utilisateur connecté
 * - Filtres : all / draft / published
 * - Pagination
 */
export default function MyArticles() {
  const [articles, setArticles] = useState([]);

  const [status, setStatus] = useState("all"); // all | draft | published
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /* =====================================================
     FETCH MY ARTICLES (PAGINATED)
  ===================================================== */
  const fetchMyArticles = async () => {
    try {
      setLoading(true);

      const res = await articleService.getMine({
        page,
        limit: 10,
        status,
      });

      setArticles(res.articles);
      setTotalPages(res.totalPages);
      setError(null);
    } catch (err) {
      console.error("Erreur chargement mes articles :", err);
      setError("Impossible de charger vos articles");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     EFFECTS
  ===================================================== */
  useEffect(() => {
    fetchMyArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, status]);

  /* =====================================================
     HANDLERS
  ===================================================== */
  const handleStatusChange = (e) => {
    setPage(1); // reset pagination
    setStatus(e.target.value);
  };

  /* =====================================================
     RENDER
  ===================================================== */
  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      {/* ===== HEADER ===== */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          gap: "1rem",
        }}
      >
        <div>
          <h1>Mes articles</h1>

          {/* 🔽 FILTRE STATUS */}
          <div style={{ marginTop: "0.5rem" }}>
            <label htmlFor="statusFilter">
              Filtrer :
              <select
                id="statusFilter"
                value={status}
                onChange={handleStatusChange}
                style={{ marginLeft: "0.5rem" }}
              >
                <option value="all">Tous</option>
                <option value="draft">Brouillons</option>
                <option value="published">Publiés</option>
              </select>
            </label>
          </div>
        </div>

        {/* ➕ CREATE */}
        <Button onClick={() => navigate("/articles/new")}>
          Créer un article
        </Button>
      </header>

      {/* ===== LISTE ===== */}
      <MyArticleList
        articles={articles}
        onRefresh={fetchMyArticles}
      />

      {/* ===== PAGINATION ===== */}
      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </section>
  );
}
