import ArticleCard from "./ArticleCard";

export default function ArticleList({ articles }) {
  if (!Array.isArray(articles) || articles.length === 0) {
  return <p>Aucun article publié pour le moment.</p>;
}


  return (
    <div>
      {articles.map((article) =>
        article ? (
          <ArticleCard key={article._id} article={article} />
        ) : null
      )}
    </div>
  );
}
