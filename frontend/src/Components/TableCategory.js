// StyledTable.js
import styled from "styled-components";
import {
  deleteCategory,
  getCategories,
  updateCategory,
} from "../api/categoryApi";
import { useEffect, useState } from "react";

export const TableContainer = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const TableHeader = styled.thead`
  background-color: #007bff;
  color: white;
`;

export const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
  &:hover {
    background-color: #e9ecef;
  }
`;

export const TableCell = styled.td`
  padding: 12px;
  border: 1px solid #dee2e6;
  min-width: 50%;
`;

const EditButton = styled.button`
  background-color: #28a745; /* Green */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838; /* Darker green */
  }
`;

const DeleteButton = styled.button`
  background-color: #dc3545; /* Red */
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #c82333; /* Darker red */
  }
`;

const ButtonComponent = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
`;

const EditSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
`;

const EditTitle = styled.h3`
  margin-bottom: 10px;
`;

const EditInput = styled.input`
  width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const EditButton2 = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;
const TableAndEditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;
function TableCategory({ isCatAdd, setIsCatAdd }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [currentCategoryName, setCurrentCategoryName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, [isCatAdd]);

  const handleDelete = async (categoryId) => {
    try {
      const result = await deleteCategory(categoryId);
      console.log("Category deleted successfully:", result);
      setCategories(
        categories.filter((category) => category._id !== categoryId)
      );
    } catch (err) {
      console.error("Error deleting category:", err);
    }
    await setIsCatAdd((isCatAdd) => !isCatAdd);
    console.log(`Deleting category with ID: ${categoryId}`);
  };

  const handleStartEdit = (category) => {
    setEditingCategory(category);
    setCurrentCategoryName(category.category);
  };

  const handleUpdate = async () => {
    try {
      const updatedCategory = await updateCategory(
        editingCategory._id,
        currentCategoryName
      );
      console.log("Category updated successfully:", updatedCategory);
      setCategories(
        categories.map((category) =>
          category._id === editingCategory._id ? updatedCategory : category
        )
      );
      setEditingCategory(null);
      setCurrentCategoryName("");
    } catch (err) {
      console.error("Error updating category:", err);
    }
  };

  if (loading) {
    console.log("Loading");
  }
  if (error) {
    console.log("The Error is:", error);
  }

  return (
    <TableAndEditWrapper>
      <TableContainer>
        <TableHeader>
          <TableRow>
            <TableCell>Category Name</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHeader>
        <tbody>
          {categories.map((category) => (
            <TableRow key={category._id}>
              <TableCell>{category.category}</TableCell>
              <TableCell>
                <ButtonComponent>
                  <EditButton onClick={() => handleStartEdit(category)}>
                    Edit
                  </EditButton>
                  <DeleteButton onClick={() => handleDelete(category._id)}>
                    Delete
                  </DeleteButton>
                </ButtonComponent>
              </TableCell>
            </TableRow>
          ))}
        </tbody>
      </TableContainer>
      {editingCategory && (
        <EditSection>
          <EditTitle>Edit Category</EditTitle>
          <EditInput
            type="text"
            value={currentCategoryName}
            onChange={(e) => setCurrentCategoryName(e.target.value)}
          />
          <EditButton2 onClick={handleUpdate}>Save</EditButton2>
        </EditSection>
      )}
    </TableAndEditWrapper>
  );
}

export default TableCategory;
