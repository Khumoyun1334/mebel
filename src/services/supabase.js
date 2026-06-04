import { createClient } from '@supabase/supabase-js';

// URL va KEY ni to'g'ridan-to'g'ri yozing (tez sinov uchun)
const supabaseUrl = 'https://hxrwrhbbijfntbrntpxk.supabase.co';
const supabaseAnonKey = 'sb_publishable_qnJTSPaIOR5tn0dZw2RdgA_w6WOjvsJ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
  global: { headers: { apikey: supabaseAnonKey } }
});

// Tezkor eksportlar
export const getProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
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
  const { data, error } = await supabase.from('orders').update({ status, updated_at: new Date() }).eq('id', id).select();
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
  const { data, error } = await supabase.from('messages').update({ status, read_at: status === 'read' ? new Date() : null }).eq('id', id).select();
  if (error) throw error;
  return data[0];
};

export const deleteMessage = async (id) => {
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
  return true;
};