import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiTrendingUp, FiAward, FiUsers } from 'react-icons/fi';

function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-lightBg overflow-hidden pt-20">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
 
          <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            <div className="inline-flex items-center gap-2 bg-accent/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent text-xs font-semibold tracking-wide">PREMIUM 2026</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-dark leading-[1.2] mb-6">
              Zamonaviy Mebel
              <span className="block text-accent mt-2">Orzuingizdagi Uy</span>
            </h1>


            <p className="text-gray-500 text-base md:text-lg leading-relaxed max-w-lg mb-8">
              Zamonaviy uy uchun yaratilgan abadiy buyumlarni kashf eting. 
              Hashamatli materiallar, hunarmand sifati, eshikingizgacha yetkazib beriladi.
            </p>

   
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/products"
                className="group bg-accent text-white px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-accent-dark transition-all duration-300 hover:gap-3"
              >
                Kolleksiyani Ko'rish
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/categories"
                className="border-2 border-gray-300 text-dark px-8 py-3.5 rounded-full font-semibold flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-all duration-300"
              >
                Kategoriyalarni Ko'rish
              </Link>
            </div>

    
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <FiTrendingUp className="text-accent" size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-dark">500+</div>
                  <div className="text-xs text-gray-400">Mahsulotlar</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <FiUsers className="text-accent" size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-dark">12K+</div>
                  <div className="text-xs text-gray-400">Baxtli Mijozlar</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <FiAward className="text-accent" size={18} />
                </div>
                <div>
                  <div className="text-xl font-bold text-dark">15 Yil</div>
                  <div className="text-xs text-gray-400">Tajriba</div>
                </div>
              </div>
            </div>
          </div>

    
          <div className={`relative transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent z-10" />
              <img
                src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=90"
                alt="Modern Furniture"
                className="w-full h-auto object-cover rounded-2xl"
              />
            </div>
            

            <div className="absolute -bottom-6 -left-6 bg-white rounded-xl p-4 shadow-lg z-20 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent text-xl">⭐</span>
                </div>
                <div>
                  <div className="font-bold text-dark">4.9/5</div>
                  <div className="text-xs text-gray-400">Mijozlar Reytingi</div>
                </div>
              </div>
            </div>

            {/* Floating Card 2 */}
            <div className="absolute -top-6 -right-6 bg-white rounded-xl p-4 shadow-lg z-20 animate-bounce-slow delay-300">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-accent text-xl">🚚</span>
                </div>
                <div>
                  <div className="font-bold text-dark">Bepul Yetkazib</div>
                  <div className="text-xs text-gray-400">$500+ xaridlarda</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-accent rounded-full mt-2 animate-scroll" />
        </div>
      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 1.5s;
        }
        @keyframes scroll {
          0% {
            opacity: 1;
            transform: translateY(0);
          }
          100% {
            opacity: 0;
            transform: translateY(10px);
          }
        }
        .animate-scroll {
          animation: scroll 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default HeroSection;