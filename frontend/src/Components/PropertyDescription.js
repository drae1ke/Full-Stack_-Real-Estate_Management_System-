import { useState } from "react";
import styled from "styled-components";

const Name = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-top: 1.5rem;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Span = styled.span`
  font-weight: bold;
  cursor: pointer;
  margin-left: 0.5rem;
`;

function ProductDescription({ product }) {
  return (
    <Container>
      <Name>Description</Name>
      <Desc product={product} />
    </Container>
  );
}

function Desc({ product }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      {product?.description?.length < 50 ? (
        `${product.description}`
      ) : show ? (
        <Full show={show} setShow={setShow} product={product} />
      ) : (
        <Less show={show} setShow={setShow} product={product} />
      )}
    </div>
  );
}

function Less({ show, setShow, product }) {
  const text = product?.description?.substring(0, 600);
  return (
    <div>
      {text}
      <Span onClick={() => setShow((show) => !show)}> ...See More</Span>
    </div>
  );
}
function Full({ show, setShow, product }) {
  return (
    <div>
      {product?.description}
      <Span onClick={() => setShow((show) => !show)}>See Less</Span>
    </div>
  );
}

export default ProductDescription;
