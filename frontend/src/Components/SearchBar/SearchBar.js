import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../../context/SearchContext";
import { searchProperty } from "../../api/propertyApi";

const SearchBar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { applySearch, applySearchResults } = useContext(SearchContext);
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
        placeholder="Search by estate, town or county..."
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
