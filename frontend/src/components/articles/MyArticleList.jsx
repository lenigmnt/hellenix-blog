// src/components/articles/MyArticleList.jsx
import MyArticleRow from "./MyArticleRow";

export default function MyArticleList({ articles, onRefresh }) {
  if (!articles.length) {
    return <p>Vous n’avez encore aucun article.</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Titre</th>
          <th>Statut</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {articles.map((article) => (
          <MyArticleRow
            key={article._id}
            article={article}
            onRefresh={onRefresh}
          />
        ))}
      </tbody>
    </table>
  );
}
