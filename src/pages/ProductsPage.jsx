import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Footer from '../components/Footer';
import { useAdmin } from '../context/AdminContext';
import { FiSearch, FiX } from 'react-icons/fi';

function ProductsPage() {
  const { products } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
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

  const getCategoryFromSearch = (searchTerm) => {
    if (!searchTerm) return null;
    const term = searchTerm.toLowerCase();
    if (term.includes('oshxona')) return 'Oshxona Mebellari';
    if (term.includes('yotoqxona')) return 'Yotoqxona Mebellari';
    if (term.includes('mehmonxona')) return 'Mehmonxona Mebellari';
    if (term.includes('yumshoq')) return 'Yumshoq Mebellar';
    if (term.includes('ofis')) return 'Ofis Mebellari';
    return null;
  };

  const getHeaderTitle = () => {
    if (filter !== "All") return filter;
    if (search) {
      const categoryFromSearch = getCategoryFromSearch(search);
      if (categoryFromSearch) return categoryFromSearch;
      return `Qidiruv: "${search}"`;
    }
    return "Barcha Mahsulotlar";
  };

  useEffect(() => {
    if (products && products.length > 0) {
      setIsLoading(false);
    } else {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [products]);

  useEffect(() => {
    const params = {};
    if (filter !== "All") params.category = filter;
    if (sort !== "featured") params.sort = sort;
    if (search) params.q = search;
    setSearchParams(params, { replace: true });
  }, [filter, sort, search, setSearchParams]);

  let filteredProducts = (products || []).filter(p => {
    let catMatch = filter === "All" || p.category === filter;
    let searchMatch = true;
    if (search) {
      const searchLower = search.toLowerCase();
      searchMatch = 
        p.name?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.desc?.toLowerCase().includes(searchLower);
    }
    return catMatch && searchMatch;
  });
  
  if (sort === "price-asc") {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  } else if (sort === "rating") {
    filteredProducts = [...filteredProducts].sort((a, b) => b.rating - a.rating);
  }

  const clearFilters = () => {
    setFilter("All");
    setSort("featured");
    setSearch("");
  };

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
  
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      {/* Header - Animatsiyalar bilan */}
      <div className="relative bg-dark py-8 md:py-12 lg:py-15 px-4 md:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-accent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10">
          <p className="text-[10px] md:text-[11px] lg:text-xs font-bold tracking-[0.12em] uppercase text-accent mb-2 md:mb-3 animate-fadeInUp">
            {filter !== "All" || search ? "FILTER NATIJASI" : "BIZNING DO'KON"}
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-5xl font-serif font-normal text-white animate-scaleIn">
            {getHeaderTitle()}
          </h1>
          {filter !== "All" && filter !== getHeaderTitle() && (
            <p className="text-gray-400 text-xs md:text-sm mt-2 animate-fadeIn">{filter} bo'limi</p>
          )}
          {search && filter === "All" && !getCategoryFromSearch(search) && (
            <div className="inline-flex items-center gap-2 mt-3 bg-accent/20 rounded-full px-4 py-1.5 animate-bounceIn">
              <FiSearch size={14} className="text-accent" />
              <span className="text-white text-sm">"{search}" bo'yicha qidiruv</span>
              <button onClick={clearFilters} className="text-white/70 hover:text-white transition-all">
                <FiX size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:py-10">
        {/* Filter va Search - Animatsiyalar bilan */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {categories.map((c, idx) => (
              <button 
                key={c} 
                onClick={() => setFilter(c)} 
                className={`px-3 md:px-4 lg:px-5 py-1.5 md:py-2 rounded-full border-2 text-[11px] md:text-[12px] lg:text-[13px] font-medium cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                  filter === c 
                    ? "bg-accent border-accent text-white shadow-lg" 
                    : "border-gray-300 bg-white text-gray-600 hover:border-accent hover:text-accent"
                }`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {categoryMap[c]}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative group w-full sm:w-auto">
              <FiSearch className={`absolute left-3 top-1/2 -translate-y-1/2 transition-all duration-300 ${isSearchFocused ? 'text-accent' : 'text-gray-400'}`} size={14} />
              <input 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                placeholder="Qidirish… (masalan: divan, oshxona, stol)" 
                className={`w-full sm:w-[220px] md:w-[260px] border-2 rounded-full pl-9 pr-4 py-2 text-[12px] md:text-[13px] outline-none transition-all duration-300 focus:scale-105 ${
                  isSearchFocused ? 'border-accent shadow-lg' : 'border-gray-300'
                }`} 
              />
            </div>
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="w-full sm:w-auto border-2 border-gray-300 rounded-full px-3 md:px-4 py-2 text-[12px] md:text-[13px] outline-none cursor-pointer bg-white font-sans transition-all duration-300 hover:border-accent focus:border-accent"
            >
              <option value="featured">⭐ Tavsiya etilgan</option>
              <option value="price-asc">💰 Narxi: Arzondan Qimmatga</option>
              <option value="price-desc">💰 Narxi: Qimmatdan Arzonga</option>
              <option value="rating">🌟 Eng Yuqori Reyting</option>
            </select>
          </div>
        </div>
        
        {/* Filter tozalash - Animatsiya bilan */}
        {(filter !== "All" || sort !== "featured" || search) && (
          <div className="flex justify-end mb-4 animate-fadeIn">
            <button
              onClick={clearFilters}
              className="text-sm text-accent hover:underline flex items-center gap-1 transition-all duration-300 hover:gap-2 group"
            >
              <span>🧹 Filtrlarni tozalash</span>
            </button>
          </div>
        )}
        
        {/* Mahsulotlar soni - Animatsiya bilan */}
        <div className="flex justify-between items-center mb-6 animate-slideInRight">
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-accent text-lg">{filteredProducts.length}</span> ta mahsulot topildi
          </p>
        </div>
        
        {/* Mahsulotlar grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 animate-fadeIn">
            <div className="text-7xl mb-4 animate-bounce">🔍</div>
            <h3 className="text-2xl font-serif text-dark mb-2">Hech qanday mahsulot topilmadi</h3>
            <p className="text-gray-500 text-sm md:text-base mb-4 md:mb-6">
              {search ? `"${search}" bo'yicha hech narsa topilmadi` : "Bu kategoriyada hozircha mahsulot mavjud emas"}
            </p>
            <button 
              onClick={clearFilters}
              className="bg-accent text-white px-5 md:px-6 py-2 rounded-full text-sm hover:bg-accent-dark transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Barcha mahsulotlarni ko'rish
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 lg:gap-7">
            {filteredProducts.map((p, index) => (
              <div 
                key={p.id} 
                className="animate-fadeInUp"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;