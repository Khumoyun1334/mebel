import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useAdmin } from '../context/AdminContext';
import { FiSearch } from 'react-icons/fi';

function ProductsPage() {
  const { products } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Mahsulotlar yuklanayotganini tekshirish
  const [isLoading, setIsLoading] = useState(true);
  
  const [filter, setFilter] = useState(() => {
    return searchParams.get('category') || "All";
  });
  const [sort, setSort] = useState(() => {
    return searchParams.get('sort') || "featured";
  });
  const [search, setSearch] = useState(() => {
    return searchParams.get('q') || "";
  });
  
  const categories = ["All", "Oshxona Mebellari", "Yotoqxona Mebellari", "Mehmonxona Mebellari", "Yumshoq Mebellar", "Ofis Mebellari"];
  const categoryMap = {
    "All": "Barchasi",
    "Oshxona Mebellari": "Oshxona Mebellari",
    "Yotoqxona Mebellari": "Yotoqxona Mebellari",
    "Mehmonxona Mebellari": "Mehmonxona Mebellari",
    "Yumshoq Mebellar": "Yumshoq Mebellar",
    "Ofis Mebellari": "Ofis Mebellari"
  };

  // products o'zgarganda loading ni to'xtatish
  useEffect(() => {
    if (products && products.length > 0) {
      setIsLoading(false);
    } else {
      // 2 sekunddan keyin loading ni o'chirish (agar mahsulot bo'lmasa)
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // Filter, sort yoki search o'zgarganda URL ni yangilash
  useEffect(() => {
    const params = {};
    if (filter !== "All") params.category = filter;
    if (sort !== "featured") params.sort = sort;
    if (search) params.q = search;
    
    setSearchParams(params, { replace: true });
  }, [filter, sort, search, setSearchParams]);

  let filteredProducts = (products || []).filter(p => {
    const catMatch = filter === "All" || p.category === filter;
    const searchMatch = !search || p.name?.toLowerCase().includes(search.toLowerCase());
    return catMatch && searchMatch;
  });
  
  if (sort === "price-asc") filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  if (sort === "price-desc") filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  if (sort === "rating") filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);

  // Yuklanayotgan holat
  if (isLoading) {
    return (
      <div className="min-h-screen bg-lightBg pt-[72px]">
        <div className="bg-dark py-8 md:py-12 lg:py-15 px-4 md:px-8 text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-500/30 rounded w-32 mx-auto mb-3"></div>
            <div className="h-10 bg-gray-500/30 rounded w-64 mx-auto"></div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
          {/* Filter skeleton */}
          <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 items-start md:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              ))}
            </div>
            <div className="flex gap-3">
              <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Product skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-7">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="h-56 md:h-60 bg-gray-200"></div>
                <div className="p-3 md:p-4 pb-4 md:pb-5">
                  <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-32 mb-3"></div>
                  <div className="flex gap-1 mb-3">
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                    <div className="w-3 h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-12"></div>
                  </div>
                  <div className="h-9 bg-gray-200 rounded-xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      {/* Header */}
      <div className="bg-dark py-8 md:py-12 lg:py-15 px-4 md:px-8 text-center">
        <p className="text-[10px] md:text-[11px] lg:text-xs font-bold tracking-[0.12em] uppercase text-accent mb-2 md:mb-3">
          Bizning Do'kon
        </p>
        <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-normal text-white">
          {filter !== "All" ? filter : "Barcha Mahsulotlar"}
        </h1>
        {filter !== "All" && (
          <p className="text-gray-400 text-xs md:text-sm mt-2">{filter} bo'limidagi mahsulotlar</p>
        )}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {/* Filter va Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map(c => (
              <button 
                key={c} 
                onClick={() => setFilter(c)} 
                className={`px-3 md:px-4 lg:px-5 py-1.5 md:py-2 rounded-full border-[1.5px] text-[11px] md:text-[12px] lg:text-[13px] font-medium cursor-pointer transition-all whitespace-nowrap ${
                  filter === c ? "bg-accent border-accent text-white" : "border-gray-300 bg-white text-gray-600 hover:border-accent hover:text-accent"
                }`}
              >
                {categoryMap[c]}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                placeholder="Qidirish…" 
                className="w-full sm:w-[160px] md:w-[180px] border-[1.5px] border-gray-300 rounded-full pl-9 pr-4 py-2 text-[12px] md:text-[13px] outline-none font-sans focus:border-accent" 
              />
            </div>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="w-full sm:w-auto border-[1.5px] border-gray-300 rounded-full px-3 md:px-4 py-2 text-[12px] md:text-[13px] outline-none cursor-pointer bg-white font-sans focus:border-accent"
            >
              <option value="featured">Tavsiya etilgan</option>
              <option value="price-asc">Narxi: Arzondan Qimmatga</option>
              <option value="price-desc">Narxi: Qimmatdan Arzonga</option>
              <option value="rating">Eng Yuqori Reyting</option>
            </select>
          </div>
        </div>
        
        {/* Filter tozalash */}
        {(filter !== "All" || sort !== "featured" || search) && (
          <div className="flex justify-end mb-4">
            <button
              onClick={() => {
                setFilter("All");
                setSort("featured");
                setSearch("");
              }}
              className="text-sm text-accent hover:underline flex items-center gap-1"
            >
              🧹 Filtrlarni tozalash
            </button>
          </div>
        )}
        
        <p className="text-[12px] md:text-[13px] text-gray-400 mb-4 md:mb-6">
          {filteredProducts.length} ta mahsulot topildi
        </p>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="text-5xl md:text-6xl mb-3 md:mb-4">🔍</div>
            <h3 className="text-lg md:text-xl font-serif text-dark mb-2">Hech qanday mahsulot topilmadi</h3>
            <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">Bu kategoriyada hozircha mahsulot mavjud emas</p>
            <button 
              onClick={() => {
                setFilter("All");
                setSort("featured");
                setSearch("");
              }}
              className="bg-accent text-white px-5 md:px-6 py-2 rounded-full text-sm hover:bg-accent-dark transition-colors"
            >
              Barcha mahsulotlarni ko'rish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-7">
            {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    
    </div>
  );
}

export default ProductsPage;