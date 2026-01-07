// src/components/reviews/ReviewList.jsx
export default function ReviewList({ reviews }) {
  if (!reviews.length) {
    return <p>Aucun avis pour le moment.</p>;
  }

  return (
    <ul>
      {reviews.map((review) => (
        <li key={review._id}>
          <p>{review.content}</p>

          {review.author?.username && (
            <small>
              — {review.author.username}
            </small>
          )}
        </li>
      ))}
    </ul>
  );
}
