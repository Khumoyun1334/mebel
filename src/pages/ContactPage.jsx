import { BsTelegram } from "react-icons/bs";
import React, { useState } from "react";
import { useAdmin } from "../context/AdminContext";
import { useToast } from "../context/ToastContext";
import {
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiSend,
  FiInstagram,
  FiFacebook,
  FiTwitter,
  FiYoutube,
} from "react-icons/fi";

function ContactPage() {
  const { addContactMessage } = useAdmin();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      showToast("Iltimos, barcha majburiy maydonlarni to'ldiring!", "error");
      return;
    }

    setIsSubmitting(true);
    console.log("📧 Xabar yuborilmoqda...");

    try {
      await addContactMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || "Ko'rsatilmagan",
        subject: formData.subject || "Mavzu yo'q",
        message: formData.message,
      });

      showToast(
        "Xabaringiz muvaffaqiyatli yuborildi! Admin tez orada bog'lanadi.",
        "success",
      );
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Xatolik:", error);
      showToast("Xatolik yuz berdi. Qayta urinib ko'ring.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMapPin,
      title: "Manzil",
      details: [
        "Toshkent shahri, Amir Temur shoh ko'chasi 15",
        "O'zbekiston, 100000",
      ],
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: FiPhone,
      title: "Telefon",
      details: ["+998 (71) 123-45-67", "+998 (90) 123-45-67"],
      color: "bg-green-50 text-green-600",
    },
    {
      icon: FiMail,
      title: "Email",
      details: ["info@luxehome.uz", "support@luxehome.uz"],
      color: "bg-orange-50 text-orange-600",
    },
    {
      icon: FiClock,
      title: "Ish vaqti",
      details: [
        "Dushanba - Juma: 9:00 - 19:00",
        "Shanba: 10:00 - 17:00",
        "Yakshanba: Dam olish",
      ],
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      icon: FiInstagram,
      url: "https://instagram.com",
      color: "hover:bg-pink-500",
      bg: "bg-gradient-to-tr from-yellow-500 to-pink-500",
    },
    {
      name: "Telegram",
      icon: BsTelegram,
      url: "https://t.me",
      color: "hover:bg-blue-500",
      bg: "bg-blue-500",
    },
    {
      name: "Facebook",
      icon: FiFacebook,
      url: "https://facebook.com",
      color: "hover:bg-blue-600",
      bg: "bg-blue-600",
    },
    {
      name: "Twitter",
      icon: FiTwitter,
      url: "https://twitter.com",
      color: "hover:bg-blue-400",
      bg: "bg-blue-400",
    },
    {
      name: "YouTube",
      icon: FiYoutube,
      url: "https://youtube.com",
      color: "hover:bg-red-600",
      bg: "bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-lightBg pt-[72px]">
      <div className="relative bg-dark py-20 px-4 md:px-8 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-accent/20 animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full bg-accent/20 animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10">
          <p className="text-accent text-sm font-semibold tracking-wider uppercase mb-3">
            Biz bilan bog'laning
          </p>
          <h1 className="text-3xl md:text-5xl font-serif font-normal text-white">
            Bog'lanish
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mt-4">
            Savollaringiz bormi? Biz sizga yordam berishdan mamnunmiz. Iltimos,
            quyidagi formani to'ldiring yoki biz bilan bevosita bog'laning.
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
                <div
                  key={index}
                  className="bg-white rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${info.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark text-base md:text-lg mb-2">
                        {info.title}
                      </h3>
                      {info.details.map((detail, idx) => (
                        <p
                          key={idx}
                          className="text-gray-500 text-sm leading-relaxed"
                        >
                          {detail}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Social Media Section */}
            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm">
              <h3 className="font-semibold text-dark text-base md:text-lg mb-4">
                Bizni ijtimoiy tarmoqlarda kuzating
              </h3>
              <div className="flex gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-10 h-10 rounded-full ${social.bg} flex items-center justify-center text-white transition-all hover:scale-110 hover:shadow-lg`}
                      title={social.name}
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Eng so'nggi yangiliklar va aksiyalardan xabardor bo'ling
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-normal text-dark">
                  Xabar Yuboring
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Savol, taklif yoki shikoyatlaringizni biz bilan baham ko'ring
                </p>
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
                      required
                      placeholder="Ism familiyangiz"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white"
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
                      required
                      placeholder="email@misol.com"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white"
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
                    required
                    rows={5}
                    placeholder="Xabaringizni yozing..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-accent transition-all bg-gray-50/50 focus:bg-white resize-none"
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
      </div>
    </div>
  );
}

export default ContactPage;
