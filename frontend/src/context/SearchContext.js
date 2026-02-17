// SearchContext.js
import React, { createContext, useReducer } from "react";

const initialState = {
  searchResults: [],
  search: "",
  categoryFilter: "",
  inStockFilter: false,
};

const searchReducer = (state, action) => {
  switch (action.type) {
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "FILTER_BY_CATEGORY":
      return { ...state, categoryFilter: action.payload };
    case "FILTER_BY_STOCK":
      return { ...state, inStockFilter: action.payload };
    default:
      return state;
  }
};

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState);

  const applySearchResults = (result) => {
    dispatch({ type: "SET_SEARCH_RESULTS", payload: result });
  };

  const applySearch = (searchText) => {
    dispatch({ type: "SET_SEARCH", payload: searchText });
  };

  const applyCategoryFilter = (category) => {
    dispatch({ type: "FILTER_BY_CATEGORY", payload: category });
  };

  const applyStockFilter = (inStock) => {
    dispatch({ type: "FILTER_BY_STOCK", payload: inStock });
  };

  return (
    <SearchContext.Provider
      value={{
        ...state,
        applyCategoryFilter,
        applyStockFilter,
        applySearch,
        applySearchResults,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
