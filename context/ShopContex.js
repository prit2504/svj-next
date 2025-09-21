"use client";
import { createContext, useContext, useState } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);

  return (
    <ShopContext.Provider value={{
      category, setCategory,
      search, setSearch,
      page, setPage,
      products, setProducts,
      pages, setPages
    }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}
