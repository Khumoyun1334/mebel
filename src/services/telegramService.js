// src/services/telegramService.js
const TELEGRAM_BOT_TOKEN = '8631017902:AAHziTfx6wpV1K-zmDcue3F9inqjaeGfA3U'; // BotFather dan olingan token
const TELEGRAM_CHAT_ID = '-5241056102'; // Admin chat ID (o'zingizning chat ID)

// Telegramga xabar yuborish
export const sendTelegramMessage = async (message) => {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram bot token yoki chat ID sozlanmagan');
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
      throw new Error(data.description);
    }
    console.log('✅ Telegram xabar yuborildi');
    return true;
  } catch (error) {
    console.error('❌ Telegram xabar yuborishda xatolik:', error);
    return false;
  }
};

// Buyurtma xabarini formatlash
export const formatOrderMessage = (order) => {
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
  
  const itemsList = order.items?.map(item => 
    `  • ${item.name} x${item.qty} = $${(item.price * item.qty).toLocaleString()}`
  ).join('\n') || '  • Mahsulotlar yo\'q';

  return `
🛍 <b>YANGI BUYURTMA!</b> 🛍

<b>📋 Buyurtma #${order.id}</b>
<b>📅 Vaqt:</b> ${new Date(order.created_at || order.createdAt).toLocaleString()}
<b>📊 Holat:</b> ${statusEmoji[order.status]} ${statusName[order.status]}

<b>👤 Mijoz ma'lumotlari:</b>
• Ism: ${order.customerName}
• Telefon: ${order.customerPhone}
• Manzil: ${order.customerAddress}
• To'lov: ${paymentName[order.paymentMethod] || order.paymentMethod}

<b>🛒 Mahsulotlar:</b>
${itemsList}

<b>💰 Jami: $${order.total?.toLocaleString() || 0}</b>

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
  `;
};

// Contact xabarini formatlash
export const formatContactMessage = (message) => {
  return `
📧 <b>YANGI XABAR!</b> 📧

<b>👤 Kimdan:</b> ${message.name}
<b>📧 Email:</b> ${message.email}
<b>📞 Telefon:</b> ${message.phone || 'Ko\'rsatilmagan'}
<b>📅 Vaqt:</b> ${new Date(message.created_at || message.createdAt).toLocaleString()}

<b>📌 Mavzu:</b> ${message.subject || 'Mavzu yo\'q'}

<b>💬 Xabar matni:</b>
${message.message}

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
  `;
};