import { Outlet } from "react-router-dom";
import Header from "./Header";
import styled from "styled-components";

import { SearchProvider } from "../context/SearchContext";
import UserContext from "../context/UserContext";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { ProductProvider } from "../context/ProductContext";
import Footer from "./Footer/Footer";

const StyledAppLayout = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const Main = styled.main`
  background-color: white;
  flex-grow: 1;

  overflow: scroll;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

function AppLayout() {
  const { setCartAmount } = useContext(CartContext);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      setUser({
        name: "unknow",
        _id: 0,
        role: "visitor",
      });
    } else {
      setUser(user);
    }
  }, []);

  useEffect(() => {
    const storedCartAmount = localStorage.getItem("cartAmount");
    if (storedCartAmount) {
      // Parse the stored value back into a number and update the state
      setCartAmount(parseInt(storedCartAmount, 10));
    }
  }, [setCartAmount]);
  const resetUserContext = () => {
    setUser(null);
  };
  return (
    <div>
      <ProductProvider>
        <StyledAppLayout>
          <UserContext.Provider value={{ user, resetUserContext }}>
            <SearchProvider>
              <Header />
              <Main>
                <Container>
                  <Outlet />
                  <Footer />
                </Container>
              </Main>
            </SearchProvider>
          </UserContext.Provider>
        </StyledAppLayout>
      </ProductProvider>
    </div>
  );
}

export default AppLayout;
