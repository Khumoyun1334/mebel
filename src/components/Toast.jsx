import React from 'react';

function Toast({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2.5">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`${t.type === "info" ? "bg-gray-800" : "bg-success"} text-white px-4 md:px-5 py-2.5 md:py-3 rounded-lg text-xs md:text-sm font-serif shadow-lg animate-slide-in border-l-3 border-primary`}
        >
          {t.msg}
        </div>
      ))}
    </div>
  );
}

export default Toast;