'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  increaseQuantity: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  getTotal: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Cargar el carrito desde localStorage al montar el componente
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        console.log("Carrito cargado desde localStorage:", parsedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error("Error al cargar el carrito desde localStorage:", error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Guardar el carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log("Carrito guardado en localStorage:", cart);
  }, [cart]);

  const addToCart = (item: CartItem) => {
    console.log("Intentando agregar al carrito:", item);

    if (!item.price || isNaN(item.price)) {
      console.error("El precio del producto no es válido:", item);
      toast.error('Error: Producto sin precio válido');
      return;
    }

    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        const newQuantity = Math.min(existingItem.quantity + item.quantity, 10);
        if (newQuantity === existingItem.quantity) {
          toast.error('Cantidad máxima alcanzada');
          return prevCart;
        }
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: newQuantity } : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: item.quantity }];
    });

    setIsCartOpen(true);
    toast.success('Producto agregado al carrito');
  };

  const removeFromCart = (id: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    toast.success('Producto eliminado del carrito');
  };

  const decreaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
      )
    );
  };

  const increaseQuantity = (id: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + 1, 10) } : item
      )
    );
  };

  const updateQuantity = (id: number, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, Math.min(quantity, 10)) } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
    toast.success('Carrito vacío');
  };

  const getTotal = () => {
    console.log("Calculando total del carrito:", cart);
    return cart.reduce((total, item) => {
      const itemTotal = (item.price || 0) * item.quantity;
      console.log(`Producto: ${item.name} | Precio: ${item.price} | Cantidad: ${item.quantity} | Subtotal: ${itemTotal}`);
      return total + itemTotal;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
