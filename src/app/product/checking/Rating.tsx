
type RatingProps = {
  rating: number;
  count: number;
};

const Rating = ({ rating, count }: RatingProps) => {
  // Ajustar la calificación para que esté entre 4 y 5
  const adjustedRating = Math.min(Math.max(rating, 4), 5);

  const renderStars = (rating: number) => {
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - filledStars - halfStar;

    return (
      <div className="flex gap-1">
        {[...Array(filledStars)].map((_, index) => (
          <span key={`filled-${index}`} className="text-center text-yellow-500">★</span>
        ))}
        {halfStar === 1 && <span className="text-center text-yellow-500">★</span>}
        {[...Array(emptyStars)].map((_, index) => (
          <span key={`empty-${index}`} className="text-gray-400">★</span>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6 text-center">
      <h3 className="text-sm font-semibold">Valoración del Producto</h3>
      {renderStars(adjustedRating)}
      <p className="text-sm text-gray-600">{count} reseñas</p>
    </div>
  );
};

export default Rating;
