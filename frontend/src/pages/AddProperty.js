import styled from "styled-components";
import AddingCategoryTab from "../Components/AddingCategoryTab";
import AddProductForm from "../Components/AddPropertyForm";
import { useState } from "react";
import AdminPropertyTable from "../Components/AdminPropertyTable";
import { BRAND_NAME } from "../utils/siteContent";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 2rem 0 4rem;
`;

const AddProductContainer = styled.div`
  width: min(100%, 58rem);
  margin: 0 auto;
`;

const SectionCard = styled.section`
  background: #ffffff;
  border: 1px solid #d7e0d9;
  border-radius: 18px;
  padding: 1.75rem;
  box-shadow: 0 14px 40px rgba(24, 53, 40, 0.08);
`;

const HeaderBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const Eyebrow = styled.span`
  color: #1f7a4d;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 0.9rem;
`;

const Title = styled.h1`
  margin: 0;
  color: #173f2d;
`;

const Description = styled.p`
  margin: 0;
  color: #50616f;
  line-height: 1.7;
  max-width: 52rem;
`;

function AddProduct() {
  const [isCatAdd, setIsCatAdd] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePropertyAdded = () => {
    setRefreshKey((currentKey) => currentKey + 1);
  };

  return (
    <Container>
      <SectionCard>
        <HeaderBlock>
          <Eyebrow>Admin workspace</Eyebrow>
          <Title>{BRAND_NAME} listing management</Title>
          <Description>
            This is the central place to create listings, manage categories, and
            keep the Kenyan property catalogue clean and up to date.
          </Description>
        </HeaderBlock>
      </SectionCard>

      <AddProductContainer>
        <SectionCard>
          <AddProductForm
            isCatAdd={isCatAdd}
            onPropertyAdded={handlePropertyAdded}
          />
        </SectionCard>
      </AddProductContainer>

      <SectionCard>
        <AddingCategoryTab isCatAdd={isCatAdd} setIsCatAdd={setIsCatAdd} />
      </SectionCard>

      <AdminPropertyTable refreshKey={refreshKey} />
    </Container>
  );
}

export default AddProduct;
