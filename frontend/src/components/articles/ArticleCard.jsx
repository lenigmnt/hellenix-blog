// src/components/articles/ArticleCard.jsx
import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  if (!article) return null;

  const categoryName =
    typeof article.category === "object"
      ? article.category?.name
      : null;

  const PREVIEW_LENGTH = 180;
  const contentPreview = article.content
    ? article.content.slice(0, PREVIEW_LENGTH)
    : "";

  return (
    <article className="article-card clamp-2">
      {/* ================= HEADER ================= */}
      <header className="article-card__header">
        <h2 className="article-card__title">
          <Link to={`/articles/${article._id}`}>
            {article.title}
          </Link>
        </h2>

        {categoryName && (
          <div className="article-card__category">
            {categoryName}
          </div>
        )}
      </header>

      {/* ================= CONTENT ================= */}
      {contentPreview && (
        <p className="article-card__content">
          {contentPreview}
          {article.content?.length > PREVIEW_LENGTH && "…"}
        </p>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="article-card__footer">
        <span>
          {article.createdAt &&
            new Date(article.createdAt).toLocaleDateString()}
        </span>

        {article.author?.username && (
          <span>Par {article.author.username}</span>
        )}

        <span className="article-card__reviews">
          {article.reviewCount ?? 0} avis
        </span>
      </footer>
    </article>
  );
}
