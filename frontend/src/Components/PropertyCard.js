import React, { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import UserContext from "../context/UserContext";
import { imageUrl } from "../api/client";
import { formatKenyanCurrency } from "../utils/formatters";

const CardContainer = styled.div`
  display: flex;
  cursor: pointer;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  width: 300px;
  height: 500px;
  margin: 1em;
  position: relative;
  transition: height 0.3s ease, width 0.4s ease;

  &:hover {
    background-color: lightblue;
  }
`;

const CardImage = styled.img`
  width: 100%;
  min-height: 60%;
`;

const CardDetails = styled.div`
  width: 90%;
  padding: 1em;
`;

const CardName = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CardPrice = styled.p`
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  width: 100%;
  color: blue;
`;

const Description = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  font-weight: 700;
`;

const Area = styled.div`
  margin-top: 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: green;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  border-radius: 100%;
  border: 1px solid gray;
  color: white;
  background-color: red;
  padding: 0.5rem 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const ProductCard = ({ product, onDelete }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const text = product?.description?.substring(0, 50);
  const isAdmin = user.role === "admin";

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmation) {
      try {
        await onDelete(product._id);
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleClick = (event) => {
    event.preventDefault();
    navigate(`/${product._id}`);
  };

  return (
    <CardContainer>
      <CardImage
        onClick={handleClick}
        src={imageUrl(product.image)}
        alt={product.name}
      />
      <CardDetails>
        <CardPrice>{formatKenyanCurrency(product.price)}</CardPrice>
        <CardName onClick={handleClick}>{product?.name}</CardName>
        <Area>{product?.address}</Area>
        <Description>{text}</Description>
      </CardDetails>
      {isAdmin && <DeleteButton onClick={handleDelete}>X</DeleteButton>}
    </CardContainer>
  );
};

export default ProductCard;
