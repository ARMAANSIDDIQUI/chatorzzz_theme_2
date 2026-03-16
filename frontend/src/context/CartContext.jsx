import React, { createContext, useState, useContext, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('chatorzzz_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chatorzzz_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existItem = prev.find(x => x.product === product._id);
      if (existItem) {
        toast.success(`Updated ${product.name} quantity`);
        return prev.map(x => x.product === product._id ? { ...x, qty: x.qty + quantity } : x);
      } else {
        toast.success(`Added ${product.name} to cart`);
        return [...prev, {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          qty: quantity,
          stock: product.stock
        }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(x => x.product !== id));
    toast.error('Item removed from cart');
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('chatorzzz_cart');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 500 ? 0 : 50;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider value={{ 
      cartItems, 
      addToCart, 
      removeFromCart, 
      clearCart,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      cartCount: cartItems.reduce((acc, item) => acc + item.qty, 0)
    }}>
      {children}
    </CartContext.Provider>
  );
};
