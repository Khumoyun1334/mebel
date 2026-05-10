// src/services/telegramService.js

// ============ TELEGRAM SOZLAMALARI ============
const TELEGRAM_BOT_TOKEN = '8631017902:AAHziTfx6wpV1K-zmDcue3F9inqjaeGfA3U';
const TELEGRAM_CHAT_ID = '-5241056102';

// Token va Chat ID ni tekshirish
const isTelegramConfigured = () => {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
    console.warn('⚠️ Telegram bot token sozlanmagan');
    return false;
  }
  if (!TELEGRAM_CHAT_ID || TELEGRAM_CHAT_ID === 'YOUR_CHAT_ID_HERE') {
    console.warn('⚠️ Telegram chat ID sozlanmagan');
    return false;
  }
  return true;
};

// ============ ASOSIY FUNKSIYA ============
export const sendTelegramMessage = async (message) => {
  if (!isTelegramConfigured()) {
    return false;
  }
  
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    
    const data = await response.json();
    
    if (!data.ok) {
      console.error('❌ Telegram API xatosi:', data.description);
      return false;
    }
    
    console.log('✅ Telegram xabar yuborildi');
    return true;
  } catch (error) {
    console.error('❌ Telegram xabar yuborishda xatolik:', error.message);
    return false;
  }
};

// ============ BUYURTMA XABARINI FORMATLASH ============
export const formatOrderMessage = (order) => {
  // Xavfsizlik tekshiruvi
  if (!order) {
    console.warn('formatOrderMessage: order ma\'lumoti topilmadi');
    return '⚠️ Xatolik: Buyurtma ma\'lumoti topilmadi';
  }
  
  const statusEmoji = {
    pending: '⏳',
    processing: '🔄',
    completed: '✅',
    cancelled: '❌'
  };
  
  const statusName = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan'
  };

  const paymentName = {
    cash: 'Naqd pul',
    card: 'Plastik karta',
    click: 'Click',
    payme: 'Payme'
  };
  
  // Mahsulotlar ro'yxatini formatlash
  let itemsList = '';
  if (order.items && order.items.length > 0) {
    itemsList = order.items.map(item => 
      `  • ${item.name || 'Noma\'lum'} x${item.qty || 0} = $${((item.price || 0) * (item.qty || 0)).toLocaleString()}`
    ).join('\n');
  } else {
    itemsList = '  • Mahsulotlar yo\'q';
  }

  const orderId = order.id || 'Noma\'lum';
  const orderStatus = order.status || 'pending';
  const customerName = order.customerName || 'Noma\'lum';
  const customerPhone = order.customerPhone || 'Noma\'lum';
  const customerAddress = order.customerAddress || 'Noma\'lum';
  const paymentMethod = order.paymentMethod || 'cash';
  const total = order.total || 0;
  const createdAt = order.created_at || order.createdAt || new Date().toISOString();

  return `
🛍 <b>YANGI BUYURTMA!</b> 🛍

<b>📋 Buyurtma #${orderId}</b>
<b>📅 Vaqt:</b> ${new Date(createdAt).toLocaleString()}
<b>📊 Holat:</b> ${statusEmoji[orderStatus]} ${statusName[orderStatus]}

<b>👤 Mijoz ma'lumotlari:</b>
• Ism: ${customerName}
• Telefon: ${customerPhone}
• Manzil: ${customerAddress}
• To'lov: ${paymentName[paymentMethod] || paymentMethod}

<b>🛒 Mahsulotlar:</b>
${itemsList}

<b>💰 Jami: $${total.toLocaleString()}</b>

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
  `;
};

// ============ XABAR FORMATLASH ============
export const formatContactMessage = (message) => {
  // Xavfsizlik tekshiruvi
  if (!message) {
    console.warn('formatContactMessage: message ma\'lumoti topilmadi');
    return '⚠️ Xatolik: Xabar ma\'lumoti topilmadi';
  }
  
  const name = message.name || 'Noma\'lum';
  const email = message.email || 'Noma\'lum';
  const phone = message.phone || 'Ko\'rsatilmagan';
  const subject = message.subject || 'Mavzu yo\'q';
  const messageText = message.message || 'Xabar matni yo\'q';
  const createdAt = message.created_at || message.createdAt || new Date().toISOString();

  return `
📧 <b>YANGI XABAR!</b> 📧

<b>👤 Kimdan:</b> ${name}
<b>📧 Email:</b> ${email}
<b>📞 Telefon:</b> ${phone}
<b>📅 Vaqt:</b> ${new Date(createdAt).toLocaleString()}

<b>📌 Mavzu:</b> ${subject}

<b>💬 Xabar matni:</b>
${messageText}

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
  `;
};

// ============ TEST FUNKSIYASI ============
export const testTelegram = async () => {
  console.log('🔍 Telegram test...');
  const result = await sendTelegramMessage('✅ Bot ishlayapti!');
  if (result) {
    console.log('✅ Telegram muvaffaqiyatli ulandi');
  } else {
    console.log('❌ Telegram ulanishida muammo bor');
  }
  return result;
};