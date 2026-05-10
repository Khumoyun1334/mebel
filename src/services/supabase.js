import { createClient } from '@supabase/supabase-js';

// Supabase sozlamalari
const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

// Supabase mijozini yaratish
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============ MAHSULOTLAR ============

// Barcha mahsulotlarni olish
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) {
    console.error('getProducts xatosi:', error);
    throw error;
  }
  return data;
};

// Yangi mahsulot qo'shish
export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) {
    console.error('addProduct xatosi:', error);
    throw error;
  }
  return data[0];
};

// Mahsulotni tahrirlash
export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('updateProduct xatosi:', error);
    throw error;
  }
  return data[0];
};

// Mahsulotni o'chirish
export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('deleteProduct xatosi:', error);
    throw error;
  }
  return true;
};

// ============ BUYURTMALAR ============

// Barcha buyurtmalarni olish
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('getOrders xatosi:', error);
    throw error;
  }
  return data;
};

// Yangi buyurtma qo'shish
export const addOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (error) {
    console.error('addOrder xatosi:', error);
    throw error;
  }
  return data[0];
};

// Buyurtma holatini yangilash
export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('updateOrderStatus xatosi:', error);
    throw error;
  }
  return data[0];
};

// Buyurtmani o'chirish
export const deleteOrder = async (id) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('deleteOrder xatosi:', error);
    throw error;
  }
  return true;
};

// ============ XABARLAR ============

// Barcha xabarlarni olish
export const getMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('getMessages xatosi:', error);
    throw error;
  }
  return data;
};

// Yangi xabar qo'shish
export const addMessage = async (message) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select();
  
  if (error) {
    console.error('addMessage xatosi:', error);
    throw error;
  }
  return data[0];
};

// Xabar statusini yangilash (o'qilgan/read)
export const updateMessageStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ status, read_at: status === 'read' ? new Date().toISOString() : null })
    .eq('id', id)
    .select();
  
  if (error) {
    console.error('updateMessageStatus xatosi:', error);
    throw error;
  }
  return data[0];
};

// Xabarni o'chirish
export const deleteMessage = async (id) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('deleteMessage xatosi:', error);
    throw error;
  }
  return true;
};