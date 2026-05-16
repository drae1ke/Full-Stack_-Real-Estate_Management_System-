import styled from "styled-components";
import SingleProductContext from "../context/SingleProductContext";
import { useContext, useState } from "react";
import ProductDescription from "./PropertyDescription";

import UserContext from "../context/UserContext";

import Ratings from "./Ratings";
import TotalRating from "./TotalRating";
import { useNavigate } from "react-router-dom";
import PriceComp from "./PriceComp";
import { deleteProperty } from "../api/propertyApi";
import Visit from "./Visit";
import { apiUrl } from "../api/client";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;
const Name = styled.div`
  font-size: 3rem;
  font-weight: 700;
`;
const Cat = styled.span`
  color: green;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Add = styled.span`
  color: red;
  font-size: 1.5rem;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;

  align-items: center;
  gap: 1.5rem;
`;

const BuyButton = styled.button`
  background-color: green;
  color: white;
  font-weight: bold;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const EditButton = styled.button`
  background-color: orange;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
`;

const RatingContainer = styled.div``;

function ProductCol1() {
  const { product } = useContext(SingleProductContext);
  const [totalPrice, setTotalPrice] = useState(1);
  const navigate = useNavigate();

  const { user } = useContext(UserContext);
  const usertoken = JSON.parse(localStorage.getItem("user"))?.token;
  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  function handleClick() {
    navigate(`/edit/${product?._id}`);
  }

  const orders = async () => {
    const address = product?.address;
    const image = product?.image;
    try {
      const res = await fetch(apiUrl("/orders"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usertoken}`, // Corrected to use usertoken
        },
        body: JSON.stringify({
          order: {
            id: product?._id,
            inTotal: 1, // Corrected property name
            name: product?.name,
          },
          user: usertoken, // Assuming you want to send the token here
          address: address,
          money: product?.price,
          img: image,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to create order");
      }
      const data = await res.json();
      //console.log("Order created successfully:", data);
      return data;
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const updateUser = async () => {
    console.log("Requesting");
    try {
      const res = await fetch(apiUrl("/payment/user"), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${usertoken}`,
        },
        body: JSON.stringify({
          propertyId: [product?._id],
          userToken: usertoken,
        }),
      });
      await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await deleteProperty(productId);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };
  const handleBuyClick = async () => {
    if (!usertoken) {
      alert("To Buy You First Need to Login");
      navigate("/login");
    } else {
      try {
        const response = await fetch(apiUrl("/payment"), {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Assuming user.token is available and you have a way to pass it
            Authorization: `Bearer ${usertoken}`,
          },
          body: JSON.stringify({
            productId: product?._id,
            userToken: usertoken,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        if (data.message === "ok") {
          const payedOrder = await orders();
          const pay = JSON.parse(localStorage.getItem("Payed"));
          if (pay) {
            localStorage.removeItem("Payed");
          }
          localStorage.setItem("Payed", JSON.stringify(payedOrder));
          await updateUser();
          await handleDelete(product?._id);
          window.location.href = data.url;
        } else {
          window.location.href = data.url;
        }
      } catch (error) {
        console.error("Error processing payment:", error);
      }
    }
  };

  return (
    <Container>
      <Name>{product?.name}</Name>
      {isUser && (
        <Visit
          uid={user?.id}
          pid={product?._id}
          uname={user?.name}
          pname={product?.name}
        />
      )}
      <Cat>{product?.category}</Cat>
      <Add>Address: {product?.address}</Add>
      <ProductDescription product={product} />
      <PriceComp
        product={product}
        totalPrice={totalPrice}
        setTotalPrice={setTotalPrice}
      />
      <RatingContainer>
        <TotalRating />
        <Ratings />
      </RatingContainer>

      {isAdmin && (
        <ButtonContainer>
          <EditButton onClick={handleClick}>Manage Property</EditButton>
        </ButtonContainer>
      )}
      {!isAdmin && (
        <ButtonContainer>
          <BuyButton onClick={handleBuyClick}>Buy</BuyButton>
        </ButtonContainer>
      )}
    </Container>
  );
}

export default ProductCol1;
