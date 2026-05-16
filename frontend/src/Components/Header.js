import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SearchContext } from "../context/SearchContext";
import { getProperty, searchByCategory } from "../api/propertyApi";
import UserContext from "../context/UserContext";
import Logout from "./Logout";
import { getCategories } from "../api/categoryApi";
import { imageUrl } from "../api/client";
import { getCategoryOptions } from "../utils/formatters";
import { BRAND_NAME } from "../utils/siteContent";

const HeaderWrapper = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 4rem;
  padding: 1.2rem 4.8rem;
  background-color: #2c2c2c;
  border-bottom: 1px solid rgb(0, 128, 0);

  @media (max-width: 1470px) {
    padding: 1rem;
  }
`;

const SiteName = styled.button`
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
  color: #fff;
  background: transparent;
  border: none;
  transition: color 0.3s ease, font-size 0.3s ease;
  font-style: italic;

  &:hover {
    color: #28a745;
    font-size: 2.2rem;
  }
`;

const Name = styled.span`
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  font-style: italic;
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

const NavLink = styled(Link)`
  text-decoration: none;
  color: #fff;
  font-size: 1.25rem;
  font-weight: 500;
  transition: color 0.3s ease;

  &:hover {
    color: rgb(0, 100, 0);
  }

  @media (max-width: 1470px) {
    font-size: 1rem;
  }
`;

const NavLinkPrimary = styled(Link)`
  text-decoration: none;
  color: #fff;
  background-color: #007bff;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.25rem;
  font-weight: 500;
  transition: background-color 0.3s ease;

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
  width: 14rem;
  height: 3rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f8f8f8;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  &:focus {
    outline: none;
    border-color: #4caf50;
  }
`;

const PicDiv = styled.div`
  height: 4rem;
  width: 4rem;
  border-radius: 100%;
`;

function Header() {
  const [selectedCat, setSelectedCat] = useState("");
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const {
    applySearchResults,
    applyCategoryFilter,
  } = useContext(SearchContext);
  const { user } = useContext(UserContext);
  const showSearchCategory = location.pathname === "/property";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(getCategoryOptions(data));
      } catch (err) {
        setError(err.message);
        setCategories(getCategoryOptions());
      }
    };

    fetchCategories();
  }, [location.pathname]);

  const handleHeaderClick = async () => {
    const response = await getProperty();
    applySearchResults(response);
    applyCategoryFilter("");
    setSelectedCat("");
    navigate("/");
  };

  async function handleCatChange(event) {
    const selectedCategoryName = event.target.value;

    if (selectedCategoryName === "__manage_categories__") {
      navigate("/category");
      return;
    }

    if (!selectedCategoryName) {
      const response = await getProperty();
      applySearchResults(response);
      applyCategoryFilter("");
      setSelectedCat("");
      return;
    }

    setSelectedCat(selectedCategoryName);

    const results = await searchByCategory({
      categoryFilter: selectedCategoryName,
    });

    applySearchResults(results);
    applyCategoryFilter(selectedCategoryName);
  }

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <HeaderWrapper>
      <div>
        <SiteName type="button" onClick={handleHeaderClick}>
          {BRAND_NAME}
        </SiteName>
      </div>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        {isAdmin && <NavLink to="/dashboard">Dashboard</NavLink>}
        {isAdmin && <NavLink to="/visit">Visits</NavLink>}
        <NavLink to="/property">Properties</NavLink>
        {isAdmin && <NavLink to="/addProduct">Manage Listings</NavLink>}
        {showSearchCategory && (
          <StyledSelect value={selectedCat} onChange={handleCatChange}>
            <option value="">
              {selectedCat ? "Show all listings" : "Filter by category"}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category.category}>
                {category.category}
              </option>
            ))}
            {isAdmin && (
              <option value="__manage_categories__">Manage Categories</option>
            )}
          </StyledSelect>
        )}
        {isUser && <NavLink to="/userOrder">Order History</NavLink>}
        <NavLink to="/contact">Contact Us</NavLink>
        {user?.role !== "visitor" && (
          <Name>
            {user?.name}
            {user?.role === "admin" && " (Admin)"}
          </Name>
        )}
        {user?.role !== "visitor" && (
          <PicDiv>
            <UserImage src={imageUrl(user?.image)} alt={user?.name} />
          </PicDiv>
        )}

        {user?.role === "visitor" ? (
          <NavLinkPrimary to="/login">Sign in</NavLinkPrimary>
        ) : (
          <Logout />
        )}
      </NavLinks>
    </HeaderWrapper>
  );
}

export default Header;
