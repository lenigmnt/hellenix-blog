// src/components/articles/ArticleCard.jsx

export default function ArticleCard({ article }) {
  if (!article) return null;

  return (
    <article>
      <h2>{article.title || "Sans titre"}</h2>

      {article.author?.username && (
        <p>
          Par <strong>{article.author.username}</strong>
        </p>
      )}

      {article.createdAt && (
        <time dateTime={article.createdAt}>
          {new Date(article.createdAt).toLocaleDateString()}
        </time>
      )}
    </article>
  );
}
