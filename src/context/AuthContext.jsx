import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        loadUserProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  // Telefon raqamni tozalash
  const cleanPhone = (phone) => {
    let numbers = phone.replace(/\D/g, '');
    if (!numbers.startsWith('998')) {
      numbers = '998' + numbers;
    }
    if (numbers.length > 12) {
      numbers = numbers.slice(0, 12);
    }
    return numbers;
  };

  // Telefon raqamni emailga aylantirish
  const phoneToEmail = (phone) => {
    const clean = cleanPhone(phone);
    return `${clean}@phone.uz`;
  };

  // Telefon raqamni tekshirish
  const validatePhone = (phone) => {
    const clean = cleanPhone(phone);
    return clean.length === 12 && clean.startsWith('998');
  };

  // Ro'yxatdan o'tish (telefon -> email)
  const signUp = async (phone, password, fullName) => {
    try {
      const cleanNumber = cleanPhone(phone);
      
      if (!validatePhone(cleanNumber)) {
        return { success: false, error: "Telefon raqam noto'g'ri! Masalan: +998 90 123 45 67" };
      }

      if (!password || password.length < 6) {
        return { success: false, error: "Parol kamida 6 belgidan iborat bo'lishi kerak!" };
      }

      if (!fullName || fullName.trim() === '') {
        return { success: false, error: "Ism familiyangizni kiriting!" };
      }

      const email = phoneToEmail(cleanNumber);
      
      console.log('📝 Ro\'yxatdan o\'tish:', { phone: cleanNumber, email, fullName });

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            phone: cleanNumber
          }
        }
      });
      
      if (error) {
        console.error('SignUp error:', error);
        return { success: false, error: error.message };
      }
      
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert([{
            id: data.user.id,
            email: email,
            full_name: fullName,
            phone: cleanNumber,
            created_at: new Date().toISOString()
          }]);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('SignUp catch error:', error);
      return { success: false, error: error.message };
    }
  };

  // Kirish (telefon -> email)
  const signIn = async (phone, password) => {
    try {
      const cleanNumber = cleanPhone(phone);
      
      if (!validatePhone(cleanNumber)) {
        return { success: false, error: "Telefon raqam noto'g'ri!" };
      }

      if (!password) {
        return { success: false, error: "Parolni kiriting!" };
      }

      const email = phoneToEmail(cleanNumber);
      
      console.log('🔐 Kirish:', { phone: cleanNumber, email });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });
      
      if (error) {
        console.error('SignIn error:', error);
        if (error.message === "Invalid login credentials") {
          return { success: false, error: "Telefon raqam yoki parol noto'g'ri!" };
        }
        return { success: false, error: error.message };
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('SignIn catch error:', error);
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const updateProfile = async (updates) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      setProfile(data);
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getUserOrders = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data;
  };

  const getSavedAddresses = async () => {
    if (!user) return [];
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false });
    if (error) return [];
    return data;
  };

  const addAddress = async (addressData) => {
    const { data, error } = await supabase
      .from('addresses')
      .insert([{
        user_id: user.id,
        ...addressData,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const updateAddress = async (id, updates) => {
    const { data, error } = await supabase
      .from('addresses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  };

  const deleteAddress = async (id) => {
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      loading,
      signUp,
      signIn,
      signOut,
      updateProfile,
      getUserOrders,
      getSavedAddresses,
      addAddress,
      updateAddress,
      deleteAddress
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);