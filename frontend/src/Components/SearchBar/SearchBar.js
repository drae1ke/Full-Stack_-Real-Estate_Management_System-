import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { searchProperty } from "../../api/propertyApi";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const {
    searchResults,
    search: searchText,
    categoryFilter,
    inStockFilter,
    applySearch,
    applySearchResults,
    applyCategoryFilter,
  } = useContext(SearchContext);
  async function handleClick(e) {
    e.preventDefault();
    const res = await searchProperty({
      searchText: search ? search : "",
    });
    navigate("/property");
    applySearchResults(res);
    applySearch(search);
  }
  return (
    <div className="flexCenter search-bar">
      <input
        placeholder="Search by title/city/country..."
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button className="button" onClick={handleClick}>
        Search
      </button>
    </div>
  );
};

export default SearchBar;
