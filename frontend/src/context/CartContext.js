import React, { createContext, useState } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({});
  const [cartAmount, setCartAmount] = useState(0);
  return (
    <CartContext.Provider value={{ cart, setCart, cartAmount, setCartAmount }}>
      {children}
    </CartContext.Provider>
  );
};
