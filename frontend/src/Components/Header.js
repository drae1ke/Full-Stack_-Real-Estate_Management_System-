import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { SearchContext } from "../context/SearchContext";
import {
  getProperty,
  searchByCategory,
  searchProperty,
} from "../api/propertyApi";
import { useLocation, useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { CartContext } from "../context/CartContext";
import { FaCartPlus } from "react-icons/fa6";
import Logout from "./Logout";
import { getCategories } from "../api/categoryApi";
const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
  padding: 1.2rem 4.8rem;
  background-color: #2c2c2c;
  border-bottom: 1px solid rgb(0, 128, 0);

  @media (max-width: 1470px) {
    padding: 1rem;
    /* flex-direction: column; */
  }
`;

const SiteName = styled.span`
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  color: #fff; // A vibrant purple color
  transition: color 0.3s ease, font-size 0.3s ease;
  font-style: italic;

  &:hover {
    color: #28a745; // A vibrant green color for hover effect
    font-size: 2.2rem; // Increase font size on hover
  }
`;

const Name = styled.span`
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: #fff; // A vibrant purple color
  transition: color 0.3s ease, font-size 0.3s ease;
  font-style: italic;
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

const SearchBox = styled.input.attrs({
  type: "search",
  placeholder: "Search...",
})`
  width: 350px;
  height: 50px;
  margin-left: 5rem;

  @media (max-width: 1450px) {
    width: 400px;
    margin-left: 4rem;
  }
`;

const NavLinks = styled.nav`
  justify-content: center;
  align-items: center;
  display: flex;
  gap: 2rem;

  @media (max-width: 1470px) {
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const NavLink = styled.a`
  text-decoration: none;
  color: #fff;
  font-size: 1.25rem; // Increase the font size
  font-weight: 500;
  transition: color 0.3s ease; // Make the text bolder
  &:hover {
    color: rgb(0, 100, 0);
  }

  @media (max-width: 1470px) {
    font-size: 1rem;
  }
`;

const NavLink2 = styled.a`
  text-decoration: none;
  color: #fff;
  background-color: #007bff;
  padding-left: 1rem;
  padding-right: 1rem;
  height: 2rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.25rem; // Increase the font size
  font-weight: 500;
  transition: color 0.3s ease; // Make the text bolder
  &:hover {
    background-color: #0056b3;
  }

  @media (max-width: 1470px) {
    font-size: 1rem;
  }
`;

const UserImage = styled.img`
  object-fit: cover;
  width: 85%;
  height: 85%;
  max-width: 100%;
  max-height: 100%;
  border-radius: 100%;
`;

const StyledSelect = styled.select`
  font-size: 1rem;
  padding: 0.5rem;
  width: 12rem;
  height: 3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  appearance: none; /* Removes default browser styling */
  -webkit-appearance: none; /* For Safari */
  -moz-appearance: none; /* For Firefox */
  &:focus {
    outline: none;
    border-color: #4caf50; /* Example focus style */
  }
`;
const StyledLabel = styled.label`
  text-decoration: none;
  color: #fff;
  font-size: 1.25rem; // Increase the font size
  font-weight: 500;
  transition: color 0.3s ease; // Make the text bolder
  &:hover {
    color: rgb(0, 100, 0);
  }

  @media (max-width: 1470px) {
    font-size: 1rem;
  }
`;

const PicDiv = styled.div`
  height: 4rem;
  width: 4rem;
  border-radius: 100%;
`;

function Header() {
  const { cartAmount } = useContext(CartContext);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [category, SetCategory] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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
  const { user } = useContext(UserContext);
  const showSearchCategory = location.pathname === "/property";
  useEffect(() => {}, [
    searchResults,
    searchText,
    categoryFilter,
    inStockFilter,
  ]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        // console.log(data);
        SetCategory(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchCategories();
  }, []); // Empty dependency array means this effect runs once on mount

  async function handleClick(e) {
    e.preventDefault();
    const res = await searchProperty({
      searchText: search ? search : "",
    });
    applySearchResults(res);
    applySearch(search);
  }

  const handleHeaderClick = async (e) => {
    e.preventDefault();
    const response = await getProperty();
    applySearchResults(response);
    setSearch("");
    navigate(`/`);
  };

  async function handleCatChange(e) {
    const selectedCategoryName = e.target.value;
    if (selectedCategoryName === "Add Category") {
      navigate("category");
    } else {
      setSelectedCat(selectedCategoryName);

      const res = await searchByCategory({
        categoryFilter: selectedCategoryName,
      });

      console.log(res);
      applySearchResults(res);
      applyCategoryFilter(selectedCategoryName);
    }
  }

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <HeaderWrapper>
      <div>
        <SiteName onClick={handleHeaderClick}>L’Espace </SiteName>
      </div>
      <NavLinks>
     

         
        <NavLink href="/">Home</NavLink>
        {isAdmin && <NavLink href="/dashboard">Dashboard</NavLink>}
        {isAdmin && <NavLink href="/visit">Visits</NavLink>}
        <NavLink href="/property">Properties</NavLink>
        {isAdmin && <NavLink href="addProduct">Add Property</NavLink>}
        
        {showSearchCategory && (
          <StyledSelect value={selectedCat} onChange={handleCatChange}>
            <option value="">
              {selectedCat ? "Show All Product" : "Search with Category"}
            </option>
            {category?.map((cat) => (
              <option key={cat._id} value={cat.category}>
                {cat.category}
              </option>
            ))}
            {isAdmin && <option>Add Category</option>}
          </StyledSelect>
        )}
        {isUser && <NavLink href="/userOrder">User History</NavLink>}
        <NavLink href="/contact">Contact Us</NavLink>
        {user?.role !== "visitor" && (
          <Name>
            {user?.name}
            {user?.role === "admin" && " (Admin)"}
          </Name>
        )}
        {user?.role !== "visitor" && (
          <PicDiv>
            <UserImage
              src={`http://localhost:8080/images/${user?.image}`}
              alt={user?.name}
            />
          </PicDiv>
        )}

        {user?.role === "visitor" ? (
          <NavLink2 href="/login">Sign in</NavLink2>
        ) : (
          <Logout />
        )}
      </NavLinks>
    </HeaderWrapper>
  );
}

export default Header;
