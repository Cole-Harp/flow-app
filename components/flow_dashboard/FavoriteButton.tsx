"use client";

import { useState } from 'react';

function FavoriteButton({ onFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite(!isFavorite);
  };

  return (
    <button
      className={`${
        isFavorite ? 'text-red-500' : 'text-gray-500'
      } transition-colors duration-200`}
      onClick={handleClick}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
}

export default FavoriteButton;