import { useContext, useState } from "react";
import StarRating from "./StarRating";
import styled from "styled-components";
import SingleProductContext from "../context/SingleProductContext";
import { updateStar } from "../api/propertyApi";
import UserContext from "../context/UserContext";

const Container = styled.div`
  display: flex;
  min-width: 25rem;
  border-radius: 1rem;
  flex-direction: column;
  margin-top: 2rem;
  gap: 1rem;
`;

const StyledDiv = styled.div`
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: red;
`;

const Button = styled.button`
  height: 3rem;
  width: 15rem;
  cursor: pointer;
  background-color: Orange;
  border-radius: 1rem;
  font-weight: 750;
  font-size: 1.5rem;
  color: black;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.8);
  border: none;
  margin-bottom: 1rem;
  transition: background-color 0.3s ease, height 0.3s ease, width 0.3s ease;
`;

function Ratings() {
  const { product, render, setRender } = useContext(SingleProductContext);
  const [CurRating, setCurRating] = useState();
  const [giveRating, setGiveRating] = useState(false);
  const { user } = useContext(UserContext);
  async function calculate() {
    const totRating = product?.totalRating;
    const updatedTotalRating = totRating + 1;
    const rat = product?.rating;
    const avg = (rat * totRating + CurRating) / updatedTotalRating;
    return { rating: avg, totalRating: updatedTotalRating };
  }

  async function handleRating(e) {
    e.preventDefault();
    const calculatedRating = await calculate();
    console.log(calculatedRating);
    await updateStar(calculatedRating, product._id);
    setRender(!render);
    setGiveRating(!giveRating);
  }

  return (
    <Container>
      <>
        <StarRating maxRating={5} size={36} onSetRating={setCurRating} />
        {user?.role === "user" ? (
          <Button onClick={handleRating}>Add Rating</Button>
        ) : user?.role === "admin" ? (
          <StyledDiv>Log in as a user to give rattings</StyledDiv>
        ) : (
          <StyledDiv>Log in as a user to give rattings</StyledDiv>
        )}
      </>
    </Container>
  );
}

export default Ratings;
