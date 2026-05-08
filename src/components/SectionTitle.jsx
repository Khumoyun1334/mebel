import React from 'react';

function SectionTitle({ label, title, sub }) {
  return (
    <div className="text-center mb-14">
      <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent mb-3">{label}</p>
      <h2 className="text-[clamp(28px,4vw,44px)] font-serif font-normal text-dark mb-4 tracking-[-0.02em]">{title}</h2>
      {sub && <p className="text-base text-gray-500 max-w-[500px] mx-auto leading-relaxed">{sub}</p>}
    </div>
  );
}

export default SectionTitle;