import styled from "styled-components";

import { useContext, useEffect, useState } from "react";
import { getCategories } from "../api/categoryApi";
//import ProductComponent from "../Components/ProductComponent";
import ProductWithPagination from "../Components/Pagination";
import { SearchContext } from "../context/SearchContext";
import { searchByStock, searchProperty } from "../api/propertyApi";
import UserContext from "../context/UserContext";
import { useLocation } from "react-router-dom";

const Container = styled.div`
  margin-top: 1.5rem;
  display: flex;
  min-height: 80vh; // Ensure the container takes at least the full viewport height
  height: 100%; // Take up any remaining space if the content is less than the viewport height
  gap: 2rem; // Adjust the gap between columns as needed
`;

const Column2 = styled.div`
  flex: 8;
  display: flex;
  gap: 1rem;
  flex-direction: column;
  background-color: white; // Example background color for visibility
  min-height: calc(
    80vh - 2rem
  ); // Subtract the total gap to account for the gap between columns
`;

const SearchButton = styled.button`
  background-color: #007bff; // Button color
  color: white; // Text color
  border: none; // Remove default button border
  cursor: pointer; // Change cursor to pointer on hover
  border-radius: 10%; // Make the button round
  width: 50px; // Width of the button
  height: 50px; // Height of the button
  margin-left: 1rem;
  margin-right: 1rem; // Space between the search box and the button// Use flex to center the icon inside the button
  align-items: center; // Vertically center the icon
  justify-content: center; // Horizontally center the icon
  transition: background-color 0.3s ease; // Smooth transition for color change
  height: 2.5rem;
  width: 5rem;

  &:hover {
    background-color: #0056b3; // Darken the button color on hover
  }
`;
const SearchContainer = styled.div`
  display: flex;
  margin: 0 auto;
  margin-top: 1rem;
`;
const SearchBox = styled.input.attrs({
  type: "search",
  placeholder: "Search by City or Area Name...",
})`
  width: 450px;
  height: 50px;
  margin-left: 5rem;

  @media (max-width: 1450px) {
    width: 400px;
    margin-left: 4rem;
  }
`;

function Products() {
  const [search, setSearch] = useState("");
  const location = useLocation();
  const {
    searchResults,
    search: searchText,
    categoryFilter,
    inStockFilter,
    applySearch,
    applySearchResults,
    applyCategoryFilter,
  } = useContext(SearchContext);
  const showSearchBox = location.pathname === "/property";
  useEffect(() => {}, [
    searchResults,
    searchText,
    categoryFilter,
    inStockFilter,
  ]);

  async function handleClick(e) {
    e.preventDefault();
    const res = await searchProperty({
      searchText: search ? search : "",
    });
    applySearchResults(res);
    applySearch(search);
  }

  return (
    <>
      {showSearchBox && (
        <SearchContainer>
          <SearchBox
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchButton onClick={handleClick}>Search</SearchButton>
        </SearchContainer>
      )}
      <Container>
        <Column2>
          <ProductWithPagination />
        </Column2>
      </Container>
    </>
  );
}

export default Products;
