import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useAdmin } from '../context/AdminContext';
import { FiSearch } from 'react-icons/fi';

function ProductsPage() {
  const { products } = useAdmin();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("featured");
  const [search, setSearch] = useState(searchParams.get('q') || "");
  
  const categories = ["All", "Oshxona Mebellari", "Yotoqxona Mebellari", "Mehmonxona Mebellari", "Yumshoq Mebellar", "Ofis Mebellari"];
  const categoryMap = {
    "All": "Barchasi",
    "Oshxona Mebellari": "Oshxona Mebellari",
    "Yotoqxona Mebellari": "Yotoqxona Mebellari",
    "Mehmonxona Mebellari": "Mehmonxona Mebellari",
    "Yumshoq Mebellar": "Yumshoq Mebellar",
    "Ofis Mebellari": "Ofis Mebellari"
  };

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setSearch(q);
    }
  }, [searchParams]);

  let filteredProducts = products.filter(p => {
    const catMatch = filter === "All" || p.category === filter;
    const searchMatch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });
  
  if (sort === "price-asc") filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  if (sort === "rating") filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-lightBg">
      <div className="bg-dark py-12 md:py-15 px-4 md:px-8 text-center">
        <p className="text-[11px] font-bold tracking-[0.12em] uppercase text-accent mb-3">Bizning Do'kon</p>
        <h1 className="text-3xl md:text-[clamp(32px,5vw,56px)] font-serif font-normal text-white">Barcha Mahsulotlar</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setFilter(c)} 
                className={`px-4 md:px-5 py-1.5 md:py-2 rounded-full border-[1.5px] text-[12px] md:text-[13px] font-medium cursor-pointer transition-all ${
                  filter === c ? "bg-accent border-accent text-white" : "border-gray-300 bg-white text-gray-600"
                }`}
              >
                {categoryMap[c]}
              </button>
            ))}
          </div>
          <div className="flex gap-3 items-center">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Qidirish…" 
                className="border-[1.5px] border-gray-300 rounded-full pl-9 pr-4 py-2 text-[13px] outline-none font-sans w-[160px] md:w-[180px]" 
              />
            </div>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="border-[1.5px] border-gray-300 rounded-full px-3 md:px-4 py-2 text-[12px] md:text-[13px] outline-none cursor-pointer bg-white font-sans"
            >
              <option value="featured">Tavsiya etilgan</option>
              <option value="price-asc">Narxi: Arzondan Qimmatga</option>
              <option value="price-desc">Narxi: Qimmatdan Arzonga</option>
              <option value="rating">Eng Yuqori Reyting</option>
            </select>
          </div>
        </div>
        
        <p className="text-[13px] text-gray-400 mb-6 md:mb-7">{filteredProducts.length} ta mahsulot topildi</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-7">
          {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;