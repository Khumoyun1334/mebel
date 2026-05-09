import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { useAdmin } from '../context/AdminContext';
import ProductCard from '../components/ProductCard';
import SectionTitle from '../components/SectionTitle';
import Stars from '../components/Stars';
import { FiHeart, FiCheck, FiMinus, FiPlus, FiChevronRight } from 'react-icons/fi';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useAdmin();
  const { addToCart } = useCart();
  const { toggleWishlist, hasInWishlist } = useWishlist();
  const { showToast } = useToast();
  
  const product = products.find(p => p.id === parseInt(id));
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const isWishlisted = hasInWishlist(product?.id);
  
  // Galereya rasmlari - agar images bo'lmasa, asosiy rasmni ishlatamiz
  const galleryImages = product?.images && product.images.length > 0 
    ? product.images 
    : (product?.img ? [product.img] : []);
  
  const related = products.filter(p => p.category === product?.category && p.id !== product?.id).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-dark">Mahsulot topilmadi</h1>
          <Link to="/products" className="text-accent mt-4 inline-block">Mahsulotlarga qaytish</Link>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice ? product.oldPrice - product.price : 0;

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-5">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
          <Link to="/" className="text-accent hover:underline">Bosh Sahifa</Link>
          <FiChevronRight size={14} />
          <Link to="/products" className="text-accent hover:underline">Mahsulotlar</Link>
          <FiChevronRight size={14} />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-12 md:pb-20">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-20">
          {/* Rasmlar Galereyasi */}
          <div className="lg:w-1/2">
            <div className="rounded-2xl overflow-hidden h-80 md:h-[450px] bg-cream mb-4">
              <img 
                src={galleryImages[selectedImage] || product.img} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden cursor-pointer border-2 transition-all flex-shrink-0 ${
                      idx === selectedImage ? "border-accent" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mahsulot Ma'lumotlari */}
          <div className="lg:w-1/2">
            <p className="text-accent text-[11px] md:text-xs font-semibold tracking-wider uppercase mb-2">{product.category}</p>
            <h1 className="font-serif text-2xl md:text-4xl font-normal text-dark mb-3 md:mb-4 leading-tight">{product.name}</h1>
            <div className="flex items-center gap-3 mb-5 md:mb-6">
              <Stars rating={product.rating} />
              <span className="text-xs text-gray-400">|</span>
              <span className="text-xs text-success font-semibold">Sotuvda Bor</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6 md:mb-7 pb-6 border-b border-gray-100">
              <span className="font-serif text-2xl md:text-4xl text-dark font-normal">
                ${product.price.toLocaleString()}
              </span>
              {product.oldPrice && (
                <>
                  <span className="text-base md:text-xl text-gray-400 line-through">
                    ${product.oldPrice.toLocaleString()}
                  </span>
                  <span className="bg-green-50 text-success text-xs md:text-sm font-semibold px-2 py-1 rounded">
                    ${discount.toLocaleString()} tejang
                  </span>
                </>
              )}
            </div>
            <p className="text-sm md:text-base leading-relaxed text-gray-600 mb-6 md:mb-7">{product.desc}</p>

            {/* Ranglar */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6 md:mb-7">
                <p className="text-xs font-semibold text-dark uppercase tracking-wider mb-3">Ranglar</p>
                <div className="flex gap-2.5 flex-wrap">
                  {product.colors.slice(0, 6).map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(i)}
                      style={{ backgroundColor: c }}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        i === selectedColor ? "border-primary scale-110 shadow-md" : "border-gray-300"
                      }`}
                      title={c}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Miqdor */}
            <div className="mb-6 md:mb-7">
              <p className="text-xs font-semibold text-dark uppercase tracking-wider mb-3">Miqdor</p>
              <div className="flex items-center bg-cream rounded-xl w-fit">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-9 h-9 md:w-11 md:h-11 border-none bg-transparent cursor-pointer flex items-center justify-center rounded-l-xl">
                  <FiMinus size={14} />
                </button>
                <span className="w-10 md:w-12 text-center text-sm md:text-base font-semibold">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-9 h-9 md:w-11 md:h-11 border-none bg-transparent cursor-pointer flex items-center justify-center rounded-r-xl">
                  <FiPlus size={14} />
                </button>
              </div>
            </div>

            {/* Tugmalar */}
            <div className="flex gap-3 md:gap-4 mb-6 md:mb-7">
              <button
                onClick={() => { addToCart(product, qty); showToast(`${product.name} savatga qo'shildi!`); }}
                className="flex-1 bg-dark text-white border-none py-3 md:py-4 rounded-xl text-sm md:text-base font-serif font-semibold cursor-pointer hover:bg-accent transition-all"
              >
                Savatga Qo'shish
              </button>
              <button
                onClick={() => { toggleWishlist(product); showToast(isWishlisted ? "Istaklar ro'yxatidan o'chirildi" : "Istaklar ro'yxatiga qo'shildi!"); }}
                className={`w-11 h-11 md:w-14 md:h-14 rounded-xl border cursor-pointer flex items-center justify-center transition-all ${
                  isWishlisted ? "border-red-500 bg-red-50" : "border-gray-200 bg-white"
                }`}
              >
                <FiHeart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-500"} />
              </button>
            </div>

            {/* Xususiyatlar */}
            <div className="grid grid-cols-2 gap-3">
              {["$500+ Bepul Yetkazib Berish", "30-Kunlik Qaytarish", "2 Yillik Kafolat", "Yig'ish Xizmati"].map(f => (
                <div key={f} className="flex items-center gap-2 text-xs text-gray-500">
                  <FiCheck className="text-success" size={14} />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* O'xshash Mahsulotlar */}
        {related.length > 0 && (
          <div className="mt-12 md:mt-20">
            <SectionTitle label="Sizga Yoqishi Mumkin" title="O'xshash Mahsulotlar" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetailPage;