// Telegram botga xabar yuborish xizmati
const TELEGRAM_BOT_TOKEN = '8631017902:AAHziTfx6wpV1K-zmDcue3F9inqjaeGfA3U'; // BotFather dan olingan token
const TELEGRAM_CHAT_ID = '-5241056102'; // Admin chat ID (o'zingizning chat ID)

// Chat ID ni olish uchun: @userinfobot ga yozing

export const sendTelegramMessage = async (message) => {
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
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.description);
    }
    return true;
  } catch (error) {
    console.error('Telegram xabar yuborishda xatolik:', error);
    return false;
  }
};

export const sendPhotoToTelegram = async (photoUrl, caption) => {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        photo: photoUrl,
        caption: caption,
        parse_mode: 'HTML',
      }),
    });
    const data = await response.json();
    return data.ok;
  } catch (error) {
    console.error('Telegram rasm yuborishda xatolik:', error);
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
  
  const itemsList = order.items.map(item => 
    `  • ${item.name} x${item.qty} = $${(item.price * item.qty).toLocaleString()}`
  ).join('\n');

  return `
🛍 <b>YANGI BUYURTMA!</b> 🛍

<b>📋 Buyurtma #${order.id}</b>
<b>📅 Vaqt:</b> ${new Date(order.createdAt).toLocaleString()}
<b>📊 Holat:</b> ${statusEmoji[order.status]} ${getStatusName(order.status)}

<b>👤 Mijoz ma'lumotlari:</b>
• Ism: ${order.customerName}
• Telefon: ${order.customerPhone}
• Manzil: ${order.customerAddress}
• To'lov: ${order.paymentMethod === 'cash' ? 'Naqd pul' : order.paymentMethod === 'card' ? 'Plastik karta' : order.paymentMethod}

<b>🛒 Mahsulotlar:</b>
${itemsList}

<b>💰 Jami: $${order.total.toLocaleString()}</b>

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
  `;
};

// Xabar xabarini formatlash
export const formatContactMessage = (message) => {
  return `
📧 <b>YANGI XABAR!</b> 📧

<b>👤 Kimdan:</b> ${message.name}
<b>📧 Email:</b> ${message.email}
<b>📞 Telefon:</b> ${message.phone}
<b>📅 Vaqt:</b> ${new Date(message.createdAt).toLocaleString()}

<b>📌 Mavzu:</b> ${message.subject}

<b>💬 Xabar matni:</b>
${message.message}

🔗 <a href="${window.location.origin}/admin">Admin panelga o'tish</a>
  `;
};

const getStatusName = (status) => {
  const names = {
    pending: 'Kutilmoqda',
    processing: 'Jarayonda',
    completed: 'Bajarildi',
    cancelled: 'Bekor qilingan'
  };
  return names[status] || status;
};