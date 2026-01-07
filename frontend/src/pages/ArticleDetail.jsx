// src/pages/ArticleDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import articleService from "../services/articleService";
import reviewService from "../services/reviewService";
import ReviewList from "../components/reviews/ReviewList";
import ReviewForm from "../components/reviews/ReviewForm";
import useAuth from "../hooks/useAuth";

export default function ArticleDetail() {
  const { id } = useParams();
  const { user } = useAuth();

  const [article, setArticle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReviews = async () => {
    const data = await reviewService.getByArticle(id);
    setReviews(data);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const articleData = await articleService.getById(id);
        setArticle(articleData);
        await fetchReviews();
      } catch (err) {
        console.error(err);
        setError("Article introuvable");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleCreateReview = async (payload) => {
    try {
      setReviewLoading(true);
      await reviewService.create(id, payload);
      await fetchReviews();
    } catch (err) {
      console.error("Erreur création review :", err);
    } finally {
      setReviewLoading(false);
    }
  };

  if (loading) return <p>Chargement…</p>;
  if (error) return <p>{error}</p>;

  return (
    <article>
      <h1>{article.title}</h1>

      <div>{article.content}</div>

      <hr />

      <h2>Avis</h2>

      <ReviewList reviews={reviews} />

      {user && (
        <ReviewForm
          onSubmit={handleCreateReview}
          loading={reviewLoading}
        />
      )}
    </article>
  );
}
