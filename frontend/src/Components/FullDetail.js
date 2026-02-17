import { useContext } from "react";
import SingleProductContext from "../context/SingleProductContext";
import styled from "styled-components";
import ProductCol1 from "./Col";

const ProductContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
`;

const Col1 = styled.div`
  background-color: white;
`;

function ProductDetailsWhole() {
  const { product } = useContext(SingleProductContext);
  return (
    <ProductContainer>
      <Col1>
        <ProductCol1 />
      </Col1>
    </ProductContainer>
  );
}

export default ProductDetailsWhole;
