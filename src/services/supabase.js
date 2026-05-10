// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase sozlamalari topilmadi!');
  console.error('URL:', supabaseUrl);
  console.error('KEY:', supabaseAnonKey ? 'Bor' : 'Yoq');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mahsulotlar
export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) throw error;
  return data;
};

export const addProduct = async (product) => {
  const { data, error } = await supabase.from('products').insert([product]).select();
  if (error) throw error;
  return data[0];
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteProduct = async (id) => {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Buyurtmalar
export const getOrders = async () => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addOrder = async (order) => {
  const { data, error } = await supabase.from('orders').insert([order]).select();
  if (error) throw error;
  return data[0];
};

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteOrder = async (id) => {
  const { error } = await supabase.from('orders').delete().eq('id', id);
  if (error) throw error;
  return true;
};

// Xabarlar
export const getMessages = async () => {
  const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return data;
};

export const addMessage = async (message) => {
  const { data, error } = await supabase.from('messages').insert([message]).select();
  if (error) throw error;
  return data[0];
};

export const updateMessageStatus = async (id, status) => {
  const { data, error } = await supabase.from('messages').update({ status, read_at: status === 'read' ? new Date().toISOString() : null }).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteMessage = async (id) => {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
  return true;
};