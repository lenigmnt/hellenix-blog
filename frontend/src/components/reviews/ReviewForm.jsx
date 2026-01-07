// src/components/reviews/ReviewForm.jsx
import { useState } from "react";

export default function ReviewForm({ onSubmit, loading }) {
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content.trim()) return;

    onSubmit({ content });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Votre avis</label><br />
        <textarea
          rows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        Publier
      </button>
    </form>
  );
}
