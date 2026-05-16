import styled from "styled-components";
import { formatKenyanCurrency } from "../utils/formatters";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
`;

const Span = styled.span`
  text-decoration: line-through;
  margin-right: 1rem;
  font-size: 2rem;
  font-weight: 700;
  color: red;
`;

const Span2 = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: green;
`;

const Discount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: red;
  border-radius: 50%;
`;

const PriceWithDiscount = styled.div`
  font-size: 2rem;
  font-weight: 700;
  border-radius: 50%;
`;

function PriceComp({ product, totalPrice }) {
  return <Price product={product} totalPrice={totalPrice} />;
}

function Price({ product, totalPrice }) {
  const basePrice =
    totalPrice > 1 ? product?.price * totalPrice : Number(product?.price || 0);
  const discountedPrice =
    basePrice - (basePrice / 100) * Number(product?.discountPercentage || 0);

  return (
    <>
      {product?.discountPercentage ? (
        <Container2>
          <PriceWithDiscount>Discount:</PriceWithDiscount>
          <Discount>{product?.discountPercentage}%</Discount>
        </Container2>
      ) : (
        ""
      )}
      <Container>
        {product?.discountPercentage > 0 ? (
          <>
            <PriceWithDiscount>Price:</PriceWithDiscount>
            <div>
              <Span>{formatKenyanCurrency(basePrice)}</Span>
              <Span2>{formatKenyanCurrency(discountedPrice)}</Span2>
            </div>
          </>
        ) : (
          <Span2>{formatKenyanCurrency(basePrice)}</Span2>
        )}
      </Container>
    </>
  );
}

export default PriceComp;
