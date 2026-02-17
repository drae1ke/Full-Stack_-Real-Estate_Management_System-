import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem; /* This centers the children vertically */
`;

const Container2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center; /* This centers the children vertically */
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

const Money = styled.span`
  font-size: 2rem;
  font-weight: 800;
`;

function PriceComp({ product, totalPrice, setTotalPrice }) {
  return <Price product={product} totalPrice={totalPrice} />;
}

function Price({ product, totalPrice }) {
  const price2 =
    totalPrice > 1 ? (product?.price * totalPrice).toFixed(2) : product?.price;
  const price =
    totalPrice > 1
      ? (
          product?.price * totalPrice -
          ((product?.price * totalPrice) / 100) * product?.discountPercentage
        ).toFixed(2)
      : product?.price - (product?.price / 100) * product?.discountPercentage;

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
            <PriceWithDiscount>Price: </PriceWithDiscount>
            <div>
              <Span>
                {price2?.toFixed(2)}
                <Money>৳</Money>
              </Span>
              <Span2>
                {price?.toFixed(2)}
                <Money>৳</Money>
              </Span2>
            </div>
          </>
        ) : (
          <Span2>
            {price2?.toFixed(2)}
            <Money>৳</Money>
          </Span2>
        )}
      </Container>
    </>
  );
}

export default PriceComp;
