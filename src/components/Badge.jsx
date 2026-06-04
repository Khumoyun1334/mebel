import React from 'react';

const badgeColors = {
  "Eng Ko'p Sotilgan": "#2d7a4f",
  "Yangi": "#1a6fa8",
  "Premium": "#8b4513",
  "Chegirma": "#c0392b"
};

function Badge({ text }) {
  if (!text) return null;
  const bg = badgeColors[text] || "#C89B6D";
  
  return (
    <span 
      style={{ background: bg }}
      className="text-white text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wide uppercase"
    >
      {text}
    </span>
  );
}

export default Badge;