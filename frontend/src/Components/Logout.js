import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import UserContext from "../context/UserContext";
import styled from "styled-components";

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
function Logout() {
  const { cart, setCart, cartAmount, setCartAmount } = useContext(CartContext);
  const { resetUserContext } = useContext(UserContext);

  const navigate = useNavigate();
  function handleClick() {
    setCart({});
    setCartAmount(0);
    resetUserContext();
    localStorage.removeItem("user");
    localStorage.removeItem("cartAmount");
    localStorage.removeItem("cart");
    localStorage.removeItem("order");
    navigate("/login");
  }
  return <NavLink2 onClick={handleClick}>Logout</NavLink2>;
}

export default Logout;
