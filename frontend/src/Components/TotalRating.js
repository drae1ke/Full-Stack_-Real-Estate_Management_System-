import { useContext } from "react";
import SingleProductContext from "../context/SingleProductContext";
import styled from "styled-components";

const StarContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0 auto;
  min-width: 25rem;
  border-radius: 5%;
  flex-direction: row;
`;

const RatingText = styled.div`
  font-size: 1.7rem;
  font-weight: 600;
  color: #333;
  font-family: "Arial", sans-serif;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: color 0.3s ease;
`;

const StarIcon = styled.span`
  width: 44px;
  height: 44px;
  display: block;
  cursor: pointer;
  fill: rgb(255, 244, 100);
  stroke: rgb(255, 215, 0);
`;

function TotalRating() {
  const { product } = useContext(SingleProductContext);
  return (
    <StarContainer>
      <RatingText>Total Rating {product?.rating?.toFixed(2)}</RatingText>
      <StarIcon>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0  0  20  20">
          <path d="M9.049  2.927c.3-.921  1.603-.921  1.902  0l1.07  3.292a1  1  0  00.95.69h3.462c.969  0  1.371  1.24.588  1.81l-2.8  2.034a1  1  0  00-.364  1.118l1.07  3.292c.3.921-.755  1.688-1.54  1.118l-2.8-2.034a1  1  0  00-1.175  0l-2.8  2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1  1  0  00-.364-1.118L2.98  8.72c-.783-.57-.38-1.81.588-1.81h3.461a1  1  0  00.951-.69l1.07-3.292z" />
        </svg>
      </StarIcon>
    </StarContainer>
  );
}

export default TotalRating;
