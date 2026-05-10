import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useToast } from '../context/ToastContext';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';

function ContactPage() {
  const { addContactMessage } = useAdmin();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    setIsSubmitting(true);
    
    // Xabarni admin panelga yuborish
    addContactMessage({
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Ko\'rsatilmagan',
      subject: formData.subject || 'Mavzu yo\'q',
      message: formData.message
    });
    
    setTimeout(() => {
      showToast("Xabaringiz muvaffaqiyatli yuborildi! Admin tez orada siz bilan bog'lanadi.", "success");
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setIsSubmitting(false);
    }, 500);
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Manzil",
      details: ["Toshkent shahri, Amir Temur shoh ko'chasi 15", "O'zbekiston, 100000"],
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: FiPhone,
      title: "Telefon",
      details: ["+998 (71) 123-45-67", "+998 (90) 123-45-67"],
      color: "bg-green-50 text-green-600"
    },
    {
      icon: FiMail,
      title: "Email",
      details: ["info@luxehome.uz", "support@luxehome.uz"],
      color: "bg-orange-50 text-orange-600"
    },
    {
      icon: FiClock,
      title: "Ish vaqti",
      details: ["Dushanba - Juma: 9:00 - 19:00", "Shanba: 10:00 - 17:00", "Yakshanba: Dam olish"],
      color: "bg-purple-50 text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-lightBg">
      {/* Hero Qismi */}
      <div className="relative bg-dark py-20 mt-5 px-4 md:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-accent/20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-accent/20 animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10">
          <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-3">Biz bilan bog'laning</p>
          <h1 className="text-3xl md:text-5xl font-serif font-normal text-white">Bog'lanish</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-4">
            Savollaringiz bormi? Biz sizga yordam berishdan mamnunmiz. Iltimos, quyidagi formani to'ldiring yoki biz bilan bevosita bog'laning.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-5">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center shrink-0`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark text-base md:text-lg mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-500 text-sm leading-relaxed">{detail}</p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Map */}
            <div className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="rounded-xl overflow-hidden h-48 bg-gray-100">
                <iframe
                  title="Google Maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d95949.0293160259!2d69.24006210292875!3d41.29949583813637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b0cc379e9c3%3A0xa5a9323b4aa5cb4!2sTashkent%2C%20Uzbekistan!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-normal text-dark">Xabar Yuboring</h2>
                <p className="text-gray-500 text-sm mt-2">Savol, taklif yoki shikoyatlaringizni biz bilan baham ko'ring</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Ismingiz <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ism familiyangiz"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@misol.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Telefon raqam
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+998 xx xxx xx xx"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Mavzu
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Xabar mavzusi"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Xabar <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Xabaringizni yozing..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white resize-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-white rounded-full py-3.5 text-sm font-semibold hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Yuborilmoqda...
                    </>
                  ) : (
                    <>
                      <FiSend size={16} />
                      Xabar Yuborish
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 md:mt-20">
          <div className="text-center mb-8 md:mb-12">
            <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-3">Ko'p so'raladigan savollar</p>
            <h2 className="text-2xl md:text-3xl font-serif font-normal text-dark">Tez-tez beriladigan savollar</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                q: "Yetkazib berish qancha vaqt oladi?",
                a: "Toshkent shahri bo'ylab yetkazib berish 1-2 kun, viloyatlarga 3-5 kun ichida yetkazib beriladi."
              },
              {
                q: "Mahsulotni qaytarish mumkinmi?",
                a: "Ha, sotib olingan kundan boshlab 30 kun ichida tovar qaytarilishi yoki almashtirilishi mumkin."
              },
              {
                q: "Kafolat qancha muddatga beriladi?",
                a: "Barcha mahsulotlarimizga 2 yillik kafolat beriladi."
              },
              {
                q: "To'lov usullari qanday?",
                a: "Naqd pul, plastik karta, Click, Payme va bank o'tkazmasi orqali to'lov qilishingiz mumkin."
              },
              {
                q: "Mahsulotni yig'ish xizmati bormi?",
                a: "Ha, mutaxassislarimiz tomonidan mahsulotni yig'ish xizmati mavjud (qo'shimcha to'lov evaziga)."
              },
              {
                q: "Chegirmalar haqida qayerdan bilish mumkin?",
                a: "Axborotnomalarimizga obuna bo'ling yoki ijtimoiy tarmoqlarimizni kuzatib boring."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-dark text-base md:text-lg mb-2">❓ {faq.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-16 md:mt-20 text-center">
          <p className="text-gray-500 text-sm mb-4">Bizni ijtimoiy tarmoqlarda kuzatib boring</p>
          <div className="flex justify-center gap-4">
            {[
              { name: "Instagram", icon: "📸", color: "hover:bg-pink-500" },
              { name: "Telegram", icon: "💬", color: "hover:bg-blue-500" },
              { name: "Facebook", icon: "👍", color: "hover:bg-blue-600" },
              { name: "YouTube", icon: "▶️", color: "hover:bg-red-600" }
            ].map(social => (
              <a
                key={social.name}
                href="#"
                className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-xl transition-all ${social.color} hover:text-white hover:scale-110`}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;