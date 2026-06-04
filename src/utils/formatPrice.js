// src/utils/formatPrice.js
export const formatPrice = (price) => {
  if (!price && price !== 0) return '0 so\'m';
  
  // Raqamni butun qilib olish
  const numPrice = Math.round(Number(price));
  
  // Qo'lda formatlash
  const parts = numPrice.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.join('.') + ' so\'m';
};

export const formatPriceShort = (price) => {
  if (!price && price !== 0) return '0';
  
  const numPrice = Math.round(Number(price));
  const million = 1000000;
  const thousand = 1000;
  
  if (numPrice >= million) {
    const mln = numPrice / million;
    if (mln >= 10) {
      return Math.round(mln) + ' mln';
    } else {
      const rounded = Math.round(mln * 10) / 10;
      return rounded + ' mln';
    }
  } 
  else if (numPrice >= thousand) {
    const ming = numPrice / thousand;
    return Math.round(ming) + ' ming';
  }
  
  return numPrice.toString();
};

export const getDiscountPercent = (oldPrice, newPrice) => {
  if (!oldPrice || !newPrice) return 0;
  const old = Number(oldPrice);
  const newPriceNum = Number(newPrice);
  if (old <= newPriceNum) return 0;
  return Math.round(((old - newPriceNum) / old) * 100);
};