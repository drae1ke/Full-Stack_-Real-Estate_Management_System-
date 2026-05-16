import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { getCategories } from "../api/categoryApi";
import { addProperty } from "../api/propertyApi";
import { getCategoryOptions } from "../utils/formatters";

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background-color: #f0f0f0; // Light background color
  padding: 2rem;
  border-radius: 8px;
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const StyledInput = styled.input`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
`;

const StyledArea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  min-height: 20rem;
  width: 100%;
`;

const StyledButton = styled.button`
  padding: 0.5rem 1rem;
  height: 2.5rem;
  width: 8rem;
  margin: 0 auto;
  background-color: #4caf50; // Elegant green color
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const StyledError = styled.span`
  color: red;
  font-size: 0.8rem;
`;

const HelperText = styled.p`
  margin: 0;
  color: #5f6c7b;
  font-size: 0.95rem;
  line-height: 1.5;
`;

// Adjusted InputRow and InputField for equal size and gap
const InputRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 2rem; // Increased gap to 2rem
  flex-wrap: wrap; // Allow wrapping to accommodate different screen sizes
`;

const InputField = styled.div`
  flex: 1 1 calc(50% - 1rem); // Adjusted to ensure each input field takes up half the row minus the gap
`;

const AddProductForm = ({ isCatAdd, onPropertyAdded }) => {
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "",
    address: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const fileInputRef = useRef(null);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCategories();
        setCategories(getCategoryOptions(data));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories(getCategoryOptions());
      }
    };

    fetchData();
  }, [isCatAdd]);

  const [errors, setErrors] = useState({});

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const validate = () => {
    let tempErrors = {};
    if (!values.name) tempErrors.name = "Name is required";
    if (!values.price || values.price < 0)
      tempErrors.price = "Price must be greater than or equal to  0";
    if (values.discountPercentage < 0 || values.discountPercentage > 100) {
      tempErrors.discountPercentage = "Discount must be between  0 and  100";
    }
    if (!values.address) tempErrors.address = "Address is required";
    if (!values.category) tempErrors.category = "Category is required";
    if (!image) tempErrors.image = "Image is required";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    Object.keys(values).forEach((key) => {
      formData.append(key, values[key]);
    });

    const response = await addProperty(formData);

    if (response?.success !== true) {
      alert("Property cannot be added");
      return;
    }

    alert("Property added successfully");
    onPropertyAdded?.();

    setValues({
      name: "",
      description: "",
      price: "",
      discountPercentage: "",
      address: "",
      category: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setImage(null);
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <HelperText>
        Add homes, land, or commercial spaces for the Kenyan market. If the
        right category is missing, you can create one in the category section
        below.
      </HelperText>
      <InputRow>
        <InputField>
          <StyledLabel htmlFor="name">Name</StyledLabel>
          <StyledInput
            id="name"
            name="name"
            type="text"
            value={values.name}
            onChange={handleChange}
          />
          {errors.name && <StyledError>{errors.name}</StyledError>}
        </InputField>
        <InputField>
          <StyledLabel htmlFor="category">Category</StyledLabel>
          <StyledSelect
            id="category"
            name="category"
            value={values.category || ""}
            onChange={handleChange}
          >
            <option value=""> --- Select a Category --- </option>
            {categories.map((category) => (
              <option key={category._id} value={category.category}>
                {category.category}
              </option>
            ))}
          </StyledSelect>
          {errors.category && <StyledError>{errors.category}</StyledError>}
        </InputField>
      </InputRow>

      <StyledLabel htmlFor="description">Description</StyledLabel>
      <StyledArea
        id="description"
        name="description"
        type="text"
        value={values.description}
        onChange={handleChange}
      />
      {errors.description && <StyledError>{errors.description}</StyledError>}

      <InputRow>
        <InputField>
          <StyledLabel htmlFor="price">Price</StyledLabel>
          <StyledInput
            id="price"
            name="price"
            type="number"
            min="0"
            value={values.price}
            onChange={handleChange}
          />
          {errors.price && <StyledError>{errors.price}</StyledError>}
        </InputField>
        <InputField>
          <StyledLabel htmlFor="discountPercentage">
            Discount Percentage
          </StyledLabel>
          <StyledInput
            id="discountPercentage"
            name="discountPercentage"
            type="number"
            min="0"
            max="100"
            value={values.discountPercentage}
            onChange={handleChange}
          />
          {errors.discountPercentage && (
            <StyledError>{errors.discountPercentage}</StyledError>
          )}
        </InputField>
      </InputRow>

      <InputRow>
        <InputField>
          <StyledLabel htmlFor="address">Address</StyledLabel>
          <StyledInput
            id="address"
            name="address"
            type="text"
            value={values.address}
            onChange={handleChange}
          />
          {errors.address && <StyledError>{errors.address}</StyledError>}
        </InputField>

        <InputField>
          <StyledLabel htmlFor="image">Listing Image</StyledLabel>
          <StyledInput
            id="image"
            name="image"
            type="file"
            ref={fileInputRef}
            value={values.image}
            onChange={handleImageChange}
          />
          {errors.image && <StyledError>{errors.image}</StyledError>}
        </InputField>
      </InputRow>

      <StyledButton type="submit">Add Property</StyledButton>
    </StyledForm>
  );
};

export default AddProductForm;
