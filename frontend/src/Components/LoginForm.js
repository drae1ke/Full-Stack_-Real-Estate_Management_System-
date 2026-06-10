import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { apiUrl } from "../api/client";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  color: #35465a;
  font-weight: 700;
`;

const Input = styled.input`
  min-height: 3.15rem;
  border-radius: 16px;
  border: 1px solid rgba(19, 34, 57, 0.1);
  padding: 0 0.9rem;
  background: #f8fafc;
  color: #142239;
`;

const Button = styled.button`
  min-height: 3.2rem;
  border: none;
  border-radius: 18px;
  background: linear-gradient(135deg, #132239, #27446a);
  color: white;
  font-weight: 800;
  cursor: pointer;
`;

const Helper = styled.p`
  margin: 0;
  color: #5b6c80;
  line-height: 1.7;
`;

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(apiUrl("/auth/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const text = await response.text();
        alert(`Login failed: ${response.status} ${response.statusText}\n${text.slice(0,200)}`);
        return;
      }

      let data;
      try {
        data = await response.json();
      } catch (err) {
        alert('Unexpected response format from server.');
        return;
      }

      if (response.status === 401 || !data.token) {
        alert("Wrong password or email");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      navigate(data?.role === "admin" ? "/dashboard" : "/");
    } catch (err) {
      alert('Network error: ' + err.message);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Helper>
        Sign in to access tenant records, booking approvals, dashboard
        analytics, and your portfolio workflows.
      </Helper>

      <Field>
        Email
        <Input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </Field>

      <Field>
        Password
        <Input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </Field>

      <Button type="submit">Sign In</Button>
    </Form>
  );
}

export default LoginForm;
