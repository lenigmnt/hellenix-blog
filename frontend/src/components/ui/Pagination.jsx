// src/components/ui/Pagination.jsx
import Button from "./Button";

/**
 * Pagination UI
 * ---------------------------------------------------------
 * Props :
 * - page        : numéro de page actuel
 * - totalPages : nombre total de pages
 * - onPageChange(page)
 */
export default function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  return (
    <nav
      aria-label="Pagination"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      <Button
        variant="secondary"
        onClick={handlePrev}
        disabled={page === 1}
      >
        ← Précédent
      </Button>

      <span>
        Page <strong>{page}</strong> / {totalPages}
      </span>

      <Button
        variant="secondary"
        onClick={handleNext}
        disabled={page === totalPages}
      >
        Suivant →
      </Button>
    </nav>
  );
}
