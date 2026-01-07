// src/pages/Home.jsx
import { useEffect, useState } from "react";
import articleService from "../services/articleService";
import categoryService from "../services/categoryService";
import ArticleList from "../components/articles/ArticleList";
import Pagination from "../components/ui/Pagination";
import "../styles/layout.css";

/**
 * Helper : profondeur d'une catégorie à partir du path
 */
const getDepth = (path = "") => path.split(".").length - 1;

export default function Home() {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await articleService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        category: selectedCategory || undefined,
      });
      setArticles(res.articles);
      setTotalPages(res.totalPages);
      setError(null);
    } catch {
      setError("Impossible de charger les articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    categoryService.getAll().then(setCategories);
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [page, search, selectedCategory]);

  return (
    <main className="home-layout">
      <div className="home-grid">
        {/* LEFT */}
        <aside className="home-sidebar">
          <label>
            Rechercher
            <input
              type="search"
              placeholder="Rechercher…"
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
            />
          </label>

          <label>
            Catégories
            <select
              value={selectedCategory}
              onChange={(e) => {
                setPage(1);
                setSelectedCategory(e.target.value);
              }}
            >
              <option value="">Toutes les catégories</option>
              {categories
                .slice()
                .sort((a, b) => a.path.localeCompare(b.path))
                .map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {"— ".repeat(getDepth(cat.path))}
                    {cat.name}
                  </option>
                ))}
            </select>
          </label>

          <small>
            {selectedCategory ? "Filtre actif" : "Aucun filtre"}
          </small>
        </aside>

        {/* CENTER */}
        <section className="home-content">
          <h2>Articles</h2>
          <small>Du plus récent au plus ancien</small>

          {loading && <p>Chargement…</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <>
              <ArticleList articles={articles} />
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </>
          )}
        </section>

        {/* RIGHT */}
        <aside className="home-aside">
          <article>
            <header>
              <strong>Connexion</strong>
            </header>
            <p>
              <small>
                Connecte-toi pour écrire des reviews et gérer tes articles.
              </small>
            </p>
            <footer>
              <a href="/register" role="button">
                Créer un compte
              </a>
              <a href="/login" role="button" className="secondary">
                Se connecter
              </a>
            </footer>
          </article>

          <article>
            <header>
              <strong>Up next</strong>
            </header>
            <ul>
              <li><small>À lire — derniers articles</small></li>
              <li><small>Explorer — catégories</small></li>
              <li><small>Découvertes — bientôt</small></li>
            </ul>
          </article>
        </aside>
      </div>
    </main>
  );
}
