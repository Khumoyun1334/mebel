import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { PRODUCTS } from '../data/data';

function ProductsPage({ setPage, setDetailProduct }) {
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState("");
  
  const categories = ["All", ...new Set(PRODUCTS.map(p => p.category))];
  const categoryMap = {
    "All": "Barchasi",
    "Yashash Xonasi": "Yashash Xonasi",
    "Ovqat Xonasi": "Ovqat Xonasi",
    "Yotoqxona": "Yotoqxona",
    "Yoritish": "Yoritish",
    "Saqlash": "Saqlash"
  };

  let products = PRODUCTS.filter(p => {
    const catMatch = filter === "All" || p.category === filter;
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });
  
  if (sort === "price-asc") products = [...products].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") products = [...products].sort((a, b) => b.price - a.price);
  if (sort === "rating") products = [...products].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-dark py-15 px-8 text-center">
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent mb-3">Bizning Do'kon</p>
        <h1 className="text-[clamp(32px,5vw,56px)] font-serif font-normal text-white">Barcha Mahsulotlar</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-wrap gap-4 mb-8 items-center justify-between">
          <div className="flex flex-wrap gap-2.5">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setFilter(c)} 
                className={`px-5 py-2 rounded-full border-[1.5px] text-[13px] font-medium cursor-pointer transition-all ${
                  filter === c ? "bg-accent border-accent text-white" : "border-gray-300 bg-white text-gray-600"
                }`}
              >
                {categoryMap[c] || c}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <input 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              placeholder="Qidirish…" 
              className="border-[1.5px] border-gray-300 rounded-full px-5 py-2 text-[13px] outline-none font-sans w-[180px]" 
            />
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="border-[1.5px] border-gray-300 rounded-full px-4 py-2 text-[13px] outline-none cursor-pointer bg-white font-sans"
            >
              <option value="featured">Tavsiya etilgan</option>
              <option value="price-asc">Narxi: Arzondan Qimmatga</option>
              <option value="price-desc">Narxi: Qimmatdan Arzonga</option>
              <option value="rating">Eng Yuqori Reyting</option>
            </select>
          </div>
        </div>
        
        <p className="text-[13px] text-gray-400 mb-7">{products.length} ta mahsulot topildi</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
          {products.map(p => <ProductCard key={p.id} product={p} onView={prod => { setDetailProduct(prod); setPage("Detail"); }} />)}
        </div>
      </div>
      
      <Footer setPage={setPage} />
    </div>
  );
}

export default ProductsPage;