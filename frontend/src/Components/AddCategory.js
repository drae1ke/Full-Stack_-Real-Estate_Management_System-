import React, { useState } from "react";
import styled from "styled-components";
import { addCategory } from "../api/categoryApi";

// Styled Components with New Look
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  padding: 20px;
  border: 2px solid #4caf50; // New color
  border-radius: 10px;
  background-color: #f0f8ff; // New color
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #4caf50; // New color
  border-radius: 4px;
  font-size: 16px;
`;

const SubmitButton = styled.button`
  background-color: #4caf50; // New color
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049; // New color
  }
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
`;

const Title = styled.h3`
  margin-top: 0;
  margin-bottom: 0.5rem;
  color: #173f2d;
`;

const HelperText = styled.p`
  margin-top: 0;
  margin-bottom: 1rem;
  color: #5f6c7b;
  line-height: 1.5;
`;

function AddCategory({ setIsCatAdd }) {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const categoryName = inputValue.trim();

    if (!categoryName) {
      alert("Enter a category name first.");
      return;
    }

    try {
      const categoryData = await addCategory({ category: categoryName });
      console.log("Category added successfully:", categoryData);

      if (!categoryData?._id) {
        return;
      }

      setInputValue("");
      setIsCatAdd((catAdd) => !catAdd);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <AddContainer>
      <FormWrapper onSubmit={handleSubmit}>
        <label htmlFor="category">
          <Title>Add a property category</Title>
        </label>
        <HelperText>
          Keep the listing form in sync by adding categories such as
          maisonettes, land, or office space here.
        </HelperText>
        <InputField
          type="text"
          id="category"
          name="category"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter category name..."
        />
        <SubmitButton type="submit">Save Category</SubmitButton>
      </FormWrapper>
    </AddContainer>
  );
}

export default AddCategory;
