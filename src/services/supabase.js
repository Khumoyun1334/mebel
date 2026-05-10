// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mahsulotlar uchun funksiyalar
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Buyurtmalar uchun funksiyalar
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateOrderStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteOrder = async (id) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Xabarlar uchun funksiyalar
export const getMessages = async () => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const addMessage = async (message) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([message])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateMessageStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ status, read_at: status === 'read' ? new Date().toISOString() : null })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteMessage = async (id) => {
  const { error } = await supabase
    .from('messages')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};