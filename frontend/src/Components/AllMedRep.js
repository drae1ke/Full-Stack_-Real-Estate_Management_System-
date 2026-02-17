import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-items: center;
  width: 100%;
  margin-top: 3rem;
`;

const StyledDiv = styled.div`
  min-height: 5rem;
  width: 90%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  justify-items: center;
  background-color: ${({ "data-index": index }) =>
    index % 2 === 0 ? "#F5F5F5" : "#FFFFFF"};
  &:hover {
    background-color: ${({ "data-index": index }) =>
      index % 2 === 0 ? "#E5E5E5" : "#f0f0f0;"};
  }
`;

const PicDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const ProductImage = styled.img`
  object-fit: cover;
  width: 85%;
  height: 85%;
  max-width: 100%;
  max-height: 100%;
`;

const NameDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const TotalItemBuyDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

const TotalItemSoldDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const TotalBuyCostDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const TotalSellCostDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;
const ProfitDiv = styled.div`
  flex: 0.5;
  width: 100%;
  height: 100%;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`;

function AllMedRep({ orders }) {
  console.log(orders?.property);
  return (
    <Container>
      <StyledDiv>
        <PicDiv></PicDiv>
        <NameDiv>Name</NameDiv>
        <TotalItemBuyDiv>Number of Items Bought</TotalItemBuyDiv>
        <TotalItemSoldDiv>Number of Items Sold</TotalItemSoldDiv>
        <TotalBuyCostDiv>Total Buying Price</TotalBuyCostDiv>
        <TotalSellCostDiv>Total Selling Price</TotalSellCostDiv>
        <ProfitDiv>Profit/Loss</ProfitDiv>
      </StyledDiv>
      {orders?.map((el, index) => (
        <ProductEl el={el} key={el._id} index={index} />
      ))}
    </Container>
  );
}

function ProductEl({ el, index }) {
  return (
    <StyledDiv data-index={index}>
      <PicDiv>
        {" "}
        <ProductImage
          src={`http://localhost:8080/images/${el?.image}`}
          alt="Product"
        />
      </PicDiv>
      <NameDiv>{el?.name}</NameDiv>
      <ProfitDiv>
        <Calc el={el} />
      </ProfitDiv>
    </StyledDiv>
  );
}

function Calc({ el }) {
  const buy = el?.buyingPrice * el?.totalItemSold;
  const sell = el?.totalSellMoney;
  return (
    <CalcContainer>
      {sell >= buy ? (
        <Text>
          {(sell - buy).toFixed(2)} Taka <SideText>(Profit)</SideText>
        </Text>
      ) : (
        <Danger>
          -{(buy - sell).toFixed(2)} Taka
          <SideText> (Loss)</SideText>
        </Danger>
      )}
    </CalcContainer>
  );
}

const CalcContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const Danger = styled.span`
  color: red;
`;
const Text = styled.span`
  color: green;
`;
const SideText = styled.span`
  font-size: 0.7rem;
`;

export default AllMedRep;
