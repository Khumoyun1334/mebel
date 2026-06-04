import React, { useState, useEffect } from 'react';
import { FiStar, FiStar as FiStarOutline, FiUser, FiCalendar, FiThumbsUp, FiFlag } from 'react-icons/fi';
import { useToast } from '../context/ToastContext';

function ProductReviews({ productId }) {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    userName: '',
    rating: 5,
    comment: '',
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Baholarni yuklash
  useEffect(() => {
    loadReviews();
  }, [productId]);

  const loadReviews = () => {
    const saved = localStorage.getItem(`reviews_${productId}`);
    if (saved) {
      const loadedReviews = JSON.parse(saved);
      setReviews(loadedReviews);
      calculateAverage(loadedReviews);
    } else {
      setReviews([]);
      setAverageRating(0);
    }
  };

  const calculateAverage = (reviewsList) => {
    if (reviewsList.length === 0) {
      setAverageRating(0);
      return;
    }
    const sum = reviewsList.reduce((acc, review) => acc + review.rating, 0);
    setAverageRating(sum / reviewsList.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newReview.userName || !newReview.comment) {
      showToast("Iltimos, ism va fikringizni yozing!", "error");
      return;
    }

    setIsSubmitting(true);

    const review = {
      id: Date.now(),
      userName: newReview.userName,
      rating: newReview.rating,
      comment: newReview.comment,
      email: newReview.email,
      date: new Date().toISOString(),
      avatar: newReview.userName.slice(0, 2).toUpperCase(),
      helpful: 0
    };

    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    calculateAverage(updatedReviews);
    
    setNewReview({
      userName: '',
      rating: 5,
      comment: '',
      email: ''
    });
    setShowForm(false);
    setIsSubmitting(false);
    
    showToast("Fikringiz uchun rahmat!", "success");
  };

  const handleHelpful = (reviewId) => {
    const updatedReviews = reviews.map(review => 
      review.id === reviewId 
        ? { ...review, helpful: (review.helpful || 0) + 1 }
        : review
    );
    setReviews(updatedReviews);
    localStorage.setItem(`reviews_${productId}`, JSON.stringify(updatedReviews));
    showToast("Fikr foydali deb belgilandi", "success");
  };

  const StarRating = ({ rating, onRatingChange, size = "medium" }) => {
    const starSizes = {
      small: "w-4 h-4",
      medium: "w-5 h-5",
      large: "w-6 h-6"
    };
    
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange && onRatingChange(star)}
            className="focus:outline-none"
          >
            {star <= rating ? (
              <FiStar className={`${starSizes[size]} fill-warning text-warning`} />
            ) : (
              <FiStarOutline className={`${starSizes[size]} text-gray-300`} />
            )}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-10 border-t border-gray-100 pt-10">
      {/* Baholar sarlavhasi */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-serif text-dark">Mijozlar fikrlari</h3>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-bold text-accent">{averageRating.toFixed(1)}</span>
              <span className="text-gray-400">/5</span>
            </div>
            <StarRating rating={Math.round(averageRating)} size="small" />
            <span className="text-gray-400 text-sm">({reviews.length} ta fikr)</span>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-accent text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-accent-dark transition-all"
        >
          {showForm ? "Bekor qilish" : "Fikr qoldirish"}
        </button>
      </div>

      {/* Fikr qoldirish formasi */}
      {showForm && (
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Ismingiz <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newReview.userName}
                  onChange={(e) => setNewReview({...newReview, userName: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent"
                  placeholder="Ism familiyangiz"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">
                  Email (ixtiyoriy)
                </label>
                <input
                  type="email"
                  value={newReview.email}
                  onChange={(e) => setNewReview({...newReview, email: e.target.value})}
                  className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent"
                  placeholder="email@misol.com"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Baho <span className="text-red-500">*</span>
              </label>
              <StarRating 
                rating={newReview.rating} 
                onRatingChange={(rating) => setNewReview({...newReview, rating})}
                size="large"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-2">
                Fikringiz <span className="text-red-500">*</span>
              </label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-2 outline-none focus:border-accent resize-none"
                placeholder="Mahsulot haqida fikringizni yozing..."
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-accent text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-accent-dark transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Yuborilmoqda..." : "Fikr yuborish"}
            </button>
          </form>
        </div>
      )}

      {/* Fikrlar ro'yxati */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Hali hech qanday fikr yo'q. Birinchi bo'lib fikr qoldiring!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-accent font-bold text-sm">{review.avatar}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-dark">{review.userName}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating rating={review.rating} size="small" />
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <FiCalendar size={12} />
                        {new Date(review.date).toLocaleDateString('uz-UZ')}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleHelpful(review.id)}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-accent transition-all"
                >
                  <FiThumbsUp size={14} />
                  <span>{review.helpful || 0}</span>
                </button>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductReviews;