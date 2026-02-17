import { useContext } from "react";

import styled from "styled-components";
import EditForm from "./EditForm";
import { ProductContext } from "../context/ProductContext";

const EditContainer = styled.div`
  position: relative;
  width: 100%; /* Adjust as needed */
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.1rem;
  right: 0.1rem;
  border-radius: 100px;
  border: 1px solid gray;
  transition: background-color 0.3s ease, color 0.3s ease;
  &:hover {
    background-color: red;
    color: white; /* Darker Blue on Hover */
  }
`;

const WrapEditForm = styled.div`
  margin-top: 2rem;
  width: 100%; /* Ensure it takes full width */
  overflow: auto; /* Add scrollbars if content overflows */
  max-height: calc(100% - 2rem); /* Adjust based on your layout needs */
`;

function EditComp() {
  const { product, reren, setReren } = useContext(ProductContext);

  return (
    <EditContainer>
      <WrapEditForm>
        <EditForm product={product} reren={reren} setReren={setReren} />
      </WrapEditForm>
    </EditContainer>
  );
}

export default EditComp;
