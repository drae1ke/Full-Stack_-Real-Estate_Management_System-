import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiUrl } from "../api/client";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f0f8ff; // LightSkyBlue
  padding: 20px;
  border-radius: 10px;
  width: 400px;
  margin: 0 auto;
`;

const FormTitle = styled.div`
  font-size: 45px;
  font-weight: bold;
  color: blue; // DarkGreen
  margin-bottom: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const StyledLabel = styled.label`
  font-size: 25px;
  font-weight: bold;
  color: blue; // DarkGreen
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  padding: 10px;
  height: 2.5rem;
  margin-bottom: 20px;
  border: 1px solid blue; // DarkGreen
  border-radius: 5px;
`;

const StyledButton = styled.button`
  padding: 10px 20px;
  background-color: blue; // Green
  color: white;
  font-size: 1.7rem;
  font-weight: 950;
  height: 4rem;
  margin: 0 auto;
  width: 13rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #006400; // DarkGreen
  }
`;
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(apiUrl("/auth/login"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.status === 401) {
      console.log(response.status);
      alert("Wrong Password or Email");
      return;
    }
    if (data.token) {
      localStorage.setItem("user", JSON.stringify(data));
      if (data?.role === "admin") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert("Wrong password or email");
    }
  };
  return (
    <FormContainer>
      <FormTitle>Login</FormTitle>
      <StyledForm onSubmit={handleSubmit}>

        <StyledLabel htmlFor="email">Email</StyledLabel>
        <StyledInput
          id="email"
          name="email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

          
        <StyledLabel htmlFor="password">Password</StyledLabel>
        <StyledInput
          id="password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <StyledButton type="submit">Login</StyledButton>
      </StyledForm>
    </FormContainer>
  );
}

export default LoginForm;
