import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import EditForm from "./EditForm";
import { ProductContext } from "../context/ProductContext";
import { useParams } from "react-router-dom";
import { getById } from "../api/propertyApi";

const EditContainer = styled.div`
  position: relative;
  width: 100%; /* Adjust as needed */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const WrapEditForm = styled.div`
  margin-top: 2rem;
  width: 100%; /* Ensure it takes full width */
  overflow: auto; /* Add scrollbars if content overflows */
  max-height: calc(100% - 2rem); /* Adjust based on your layout needs */
`;

function EditComp() {
  const { product, reren, setReren } = useContext(ProductContext);
  const { id } = useParams();
  const [selectedProduct, setSelectedProduct] = useState(product);

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setSelectedProduct(product);
        return;
      }

      try {
        const data = await getById(id);
        setSelectedProduct(data);
      } catch (error) {
        console.error("Failed to fetch property for editing:", error);
      }
    };

    fetchProperty();
  }, [id, product]);

  if (!selectedProduct) {
    return null;
  }

  return (
    <EditContainer>
      <WrapEditForm>
        <EditForm
          product={selectedProduct}
          reren={reren}
          setReren={setReren}
        />
      </WrapEditForm>
    </EditContainer>
  );
}

export default EditComp;
