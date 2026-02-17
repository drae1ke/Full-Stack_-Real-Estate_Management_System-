import styled from "styled-components";
import ProductDetailsWhole from "../Components/FullDetail";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import SingleProductContext from "../context/SingleProductContext";
import { ProductContext } from "../context/ProductContext";
import { getById } from "../api/propertyApi";

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
const Picture = styled.img`
  width: 100%;
  height: 70vh;
`;

const ProductDetailComponent = styled.div`
  margin-left: 2rem;
  margin-right: 2rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
`;

function ProductDetail() {
  const [product, setProduct] = useState(null);
  const [render, setRender] = useState(true);

  const params = useParams();
  const { setProduct: setPro, reren } = useContext(ProductContext);
  const navigate = useNavigate();
  const productId = params.id;
  const value = {
    render,
    setRender,
    product,
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getById(productId);
        if (!response) {
          navigate("*"); // Redirect to Page Not Found if product does not exist
        }
        setProduct(response);
        setPro(response);
      } catch (error) {
        navigate("*");
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [productId, render, setPro, reren, navigate]);

  return (
    <SingleProductContext.Provider value={value}>
      <PageContainer>
        <Picture
          src={`http://localhost:8080/images/${product?.image}`}
          alt={product?.name}
        />
        <ProductDetailComponent>
          <ProductDetailsWhole />
        </ProductDetailComponent>
      </PageContainer>
    </SingleProductContext.Provider>
  );
}

export default ProductDetail;
