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

const HeaderShell = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  backdrop-filter: blur(20px);
  background: rgba(250, 252, 255, 0.86);
  border-bottom: 1px solid rgba(19, 34, 57, 0.08);
`;

const Inner = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 780px) {
    padding: 1rem;
  }
`;

const BrandButton = styled.button`
  border: none;
  background: transparent;
  color: #132239;
  font-weight: 900;
  font-size: 1.5rem;
  letter-spacing: -0.03em;
  cursor: pointer;
  font-family: "Fraunces", Georgia, serif;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const NavLink = styled(Link)`
  min-height: 2.8rem;
  padding: 0 1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: #29415f;
  font-weight: 700;
  background: rgba(19, 34, 57, 0.04);
  transition: background 160ms ease, color 160ms ease;

  &:hover {
    background: rgba(19, 34, 57, 0.08);
    color: #132239;
  }
`;

const AccentLink = styled(Link)`
  min-height: 2.8rem;
  padding: 0 1rem;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  color: white;
  font-weight: 800;
  background: linear-gradient(135deg, #132239, #27446a);
`;

const CategorySelect = styled.select`
  min-height: 2.8rem;
  border-radius: 999px;
  border: 1px solid rgba(19, 34, 57, 0.12);
  background: white;
  padding: 0 0.95rem;
  color: #29415f;
  font-weight: 700;
`;

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 0.2rem;
`;

const UserName = styled.div`
  color: #49607a;
  font-weight: 700;
`;

const Avatar = styled.img`
  width: 2.6rem;
  height: 2.6rem;
  border-radius: 999px;
  object-fit: cover;
  border: 2px solid rgba(19, 34, 57, 0.1);
`;

function Header() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { applySearchResults, applyCategoryFilter } = useContext(SearchContext);
  const { user } = useContext(UserContext);
  const showCategoryFilter = location.pathname === "/property";
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(getCategoryOptions(data));
      } catch (error) {
        setCategories(getCategoryOptions());
      }
    };

    fetchCategories();
  }, []);

  const handleBrandClick = async () => {
    const response = await getProperty();
    applySearchResults(response);
    applyCategoryFilter("");
    setSelectedCategory("");
    navigate("/");
  };

  const handleCategoryChange = async (event) => {
    const nextCategory = event.target.value;

    if (!nextCategory) {
      const response = await getProperty();
      applySearchResults(response);
      applyCategoryFilter("");
      setSelectedCategory("");
      return;
    }

    setSelectedCategory(nextCategory);
    applyCategoryFilter(nextCategory);
    const results = await searchByCategory({ categoryFilter: nextCategory });
    applySearchResults(results);
  };

  return (
    <HeaderShell>
      <Inner>
        <BrandButton type="button" onClick={handleBrandClick}>
          {BRAND_NAME}
        </BrandButton>

        <Nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/property">Availability</NavLink>
          {isAdmin && <NavLink to="/dashboard">Dashboard</NavLink>}
          {isAdmin && (
            <NavLink to="/admin/properties#property-management">
              Properties & Tenants
            </NavLink>
          )}
          {isAdmin && <NavLink to="/visit">Visits</NavLink>}
          {isUser && <NavLink to="/resident">Resident Portal</NavLink>}
          <NavLink to="/contact">Contact</NavLink>

          {showCategoryFilter && (
            <CategorySelect value={selectedCategory} onChange={handleCategoryChange}>
              <option value="">Filter by category</option>
              {categories.map((category) => (
                <option key={category._id} value={category.category}>
                  {category.category}
                </option>
              ))}
            </CategorySelect>
          )}

          {user?.role !== "visitor" && (
            <UserMeta>
              <UserName>{`${user?.name || ""}${isAdmin ? " - Admin" : ""}`}</UserName>
              {user?.image && <Avatar src={imageUrl(user.image)} alt={user.name} />}
            </UserMeta>
          )}

          {user?.role === "visitor" ? (
            <AccentLink to="/login">Sign In</AccentLink>
          ) : (
            <Logout />
          )}
        </Nav>
      </Inner>
    </HeaderShell>
  );
}

export default Header;
