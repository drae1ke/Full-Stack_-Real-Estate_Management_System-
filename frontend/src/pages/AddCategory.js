import { useState } from "react";
import AddingCategoryTab from "../Components/AddingCategoryTab";
import styled from "styled-components";

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 0 4rem;
`;

const Title = styled.h1`
  margin-bottom: 0;
  color: #173f2d;
`;

const Description = styled.p`
  margin-top: 0;
  color: #50616f;
  line-height: 1.7;
`;

function AddCategory() {
  const [isCatAdd, setIsCatAdd] = useState(false);

  return (
    <PageWrapper>
      <div>
        <Title>Category management</Title>
        <Description>
          Create, update, and delete Kenyan property categories used across the
          admin forms and property filters.
        </Description>
      </div>
      <AddingCategoryTab isCatAdd={isCatAdd} setIsCatAdd={setIsCatAdd} />
    </PageWrapper>
  );
}

export default AddCategory;
