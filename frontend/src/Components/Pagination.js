import { useContext, useEffect, useState } from "react";

import PropertyComponent from "./PropertyComponent";
import { deleteProperty, getProperty } from "../api/propertyApi";
import styled from "styled-components";
import { SearchContext } from "../context/SearchContext";

const ProductComponetContainer = styled.div``;
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const PageNumContainer = styled.div`
  height: 4rem;
  display: flex;
  justify-content: center; /* Center horizontally */
  align-items: center;
`;

const Button = styled.button`
  top: 0.1rem;
  right: 0.1rem;
  border-radius: 100%;
  border: 1px solid gray;
  font-size: 1.2rem;
  color: white;
  background-color: #2c2c2c;
  padding: 0.5rem 0.5rem;
  font-weight: bold;
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  transition: background-color 0.3s ease, color 0.3s ease;
`;
function ProductWithPagination() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const { searchResults, search, categoryFilter, inStockFilter } =
    useContext(SearchContext);

  //console.log(searchResults.length);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (searchResults.length > 0) {
          setProducts(searchResults);
          setCurrentPage(1);
        } else if (search || categoryFilter || inStockFilter) {
          setProducts([]);
          setCurrentPage(1);
        } else {
          const response = await getProperty();
          setProducts(response);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchData();
  }, [searchResults, categoryFilter, search, inStockFilter]);

  function calcProduct() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return products?.slice(
      startIndex,
      endIndex > products.length ? products.length : endIndex
    );
  }

  const newProduct = calcProduct();

  const handleDelete = async (productId) => {
    try {
      // Call the API to delete the product
      await deleteProperty(productId);
      // Filter out the deleted product from the state
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const totalPages = Math.ceil(products?.length / itemsPerPage);
  //console.log(currentPage);

  function moveNext() {
    if (currentPage >= totalPages) {
      setCurrentPage(1);
      return;
    }
    setCurrentPage(currentPage + 1);
  }
  function movePrev() {
    if (currentPage <= 1) {
      setCurrentPage(totalPages);
      return;
    }
    setCurrentPage(currentPage - 1);
  }

  function movePage(i) {
    setCurrentPage(i);
  }

  return (
    <div>
      <Container>
        <ProductComponetContainer>
          <PropertyComponent products={newProduct} onDelete={handleDelete} />
        </ProductComponetContainer>
        <PageNumContainer>
          <Button onClick={movePrev}> &lt;&lt; </Button>
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button key={i} onClick={() => movePage(i + 1)}>
              {i + 1}
            </Button>
          ))}
          <Button onClick={moveNext}>&gt;&gt;</Button>
        </PageNumContainer>
      </Container>
    </div>
  );
}

export default ProductWithPagination;
