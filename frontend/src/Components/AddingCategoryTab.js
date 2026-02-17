import React from "react";
import AddCategory from "./AddCategory";
import TableCategory from "./TableCategory";
import styled from "styled-components";

const CategoryContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
`;

function AddingCategoryTab({ isCatAdd, setIsCatAdd }) {
  return (
    <CategoryContainer>
      <AddCategory setIsCatAdd={setIsCatAdd} />
      <TableCategory isCatAdd={isCatAdd} setIsCatAdd={setIsCatAdd} />
    </CategoryContainer>
  );
}

export default AddingCategoryTab;
