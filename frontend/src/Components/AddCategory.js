import React, { useState } from "react";
import styled from "styled-components";
import { addCategory } from "../api/categoryApi";

// Styled Components with New Look
const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
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

const ToggleButton = styled.button`
  background-color: transparent;
  color: #4caf50; // New color
  border: 2px solid #4caf50; // New color
  border-radius: 10px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    background-color: #45a049; // New color
    color: white;
  }
`;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
`;

function AddCategory({ setIsCatAdd }) {
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Submitted value:", inputValue);

    try {
      const categoryData = await addCategory({ category: inputValue });
      console.log("Category added successfully:", categoryData);
      setInputValue(""); // Clear the input after submission
      setIsCatAdd((catAdd) => !catAdd);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <AddContainer>
      {isAdding ? (
        <FormWrapper onSubmit={handleSubmit}>
          <label htmlFor="category">
            <h2>Add Category</h2>
          </label>
          <InputField
            type="text"
            id="category"
            name="category"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter category name..."
          />
          <SubmitButton type="submit">Add</SubmitButton>
        </FormWrapper>
      ) : (
        <ToggleButton onClick={() => setIsAdding(true)}>
          Add New Category
        </ToggleButton>
      )}
    </AddContainer>
  );
}

export default AddCategory;
