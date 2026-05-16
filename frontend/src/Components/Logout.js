import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import UserContext from "../context/UserContext";
import styled from "styled-components";

const LogoutButton = styled.button`
  min-height: 2.8rem;
  padding: 0 1rem;
  border-radius: 999px;
  border: none;
  color: white;
  background: linear-gradient(135deg, #132239, #27446a);
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 800;

  &:hover {
    filter: brightness(1.05);
  }
`;

function Logout() {
  const { setCart, setCartAmount } = useContext(CartContext);
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
  return <LogoutButton onClick={handleClick}>Logout</LogoutButton>;
}

export default Logout;
