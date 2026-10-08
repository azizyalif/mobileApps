import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface PropertyItem {
  id: string;
  title: string;
  cluster: string;
  price: string;
  location: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  surfaceArea: string;
  buildingArea: string;
  description: string;
  features: string[];
}

interface CartContextType {
  cart: PropertyItem[];
  addToCart: (property: PropertyItem) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<PropertyItem[]>([]);

  // Load keranjang dari AsyncStorage saat aplikasi dibuka
  useEffect(() => {
    loadCart();
  }, []);

  // Simpan keranjang ke AsyncStorage setiap ada perubahan
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const loadCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('@tentram_cart');
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
    } catch (e) {
      console.error('Gagal memuat keranjang:', e);
    }
  };

  const saveCart = async (newCart: PropertyItem[]) => {
    try {
      await AsyncStorage.setItem('@tentram_cart', JSON.stringify(newCart));
    } catch (e) {
      console.error('Gagal menyimpan keranjang:', e);
    }
  };

  const addToCart = (property: PropertyItem) => {
    setCart((prev) => {
      if (prev.some((item) => item.id === property.id)) {
        return prev; // Jika sudah ada, jangan duplikasi
      }
      return [...prev, property];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const isInCart = (id: string) => {
    return cart.some((item) => item.id === id);
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};