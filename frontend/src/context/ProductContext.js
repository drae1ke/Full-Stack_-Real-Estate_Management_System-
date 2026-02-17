import React, { createContext, useState } from "react";

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [product, setProduct] = useState(false);
  const [reren, setReren] = useState(false);

  return (
    <ProductContext.Provider value={{ product, setProduct, reren, setReren }}>
      {children}
    </ProductContext.Provider>
  );
};
