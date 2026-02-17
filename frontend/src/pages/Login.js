import { useState } from "react";
import LoginForm from "../Components/LoginForm";
import SignUpFrom from "../Components/SignUpFrom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const PicContainer = styled.div`
  height: 100vh;
  position: relative;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f8ff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2px solid blue;
  /* margin: 100px auto; */
`;

const SpanContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
`;

const Span = styled.div`
  cursor: pointer;
  font-weight: 750;
  color: blue;
`;

const Span2 = styled.div`
  cursor: pointer;
  font-size: 2rem;
  font-weight: 750;
  color: white;
  background-color: green;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  padding-bottom: 0.5rem;
  padding-top: 0.5rem;
  border-radius: 20px;
  position: absolute;
  top: 5rem;
  right: 5rem;
  transition: padding-left 0.3s ease, padding-right 0.3s ease,
    padding-top 0.3s ease, padding-bottom 0.3s ease;
  &:hover {
    padding-left: 2rem;
    padding-right: 2rem;
    padding-bottom: 0.7rem;
    padding-top: 0.7rem;
  }
`;

function Login() {
  const [set, setSet] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };
  return (
    <PicContainer>
      <FormContainer>
        <div>{!set ? <LoginForm /> : <SignUpFrom setSet={setSet} />}</div>
        <SpanContainer>
          <Span onClick={(e) => setSet(!set)}>
            {set ? "Click Here For Login" : "Click Here For Registration"}
          </Span>
        </SpanContainer>
      </FormContainer>
      <Span2 onClick={handleClick}>Visit Our Page</Span2>
    </PicContainer>
  );
}

export default Login;
