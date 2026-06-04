import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

function StarRating({ rating, count }) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <FaStar key={i} className="text-warning text-sm" />
      ))}
      {hasHalfStar && <FaStarHalfAlt className="text-warning text-sm" />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
        <FaRegStar key={i} className="text-warning text-sm" />
      ))}
      {count && <span className="text-xs text-gray-400 ml-0.5">({count})</span>}
    </div>
  );
}

export default StarRating;