import { useRef, useState } from "react";
import styled from "styled-components";
import { addUser } from "../api/userApi";

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

const ErrorText = styled.span`
  color: #af2d2d;
  font-size: 0.85rem;
`;

function SignUpFrom({ setSet }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const fileInput = useRef(null);

  const validate = () => {
    const nextErrors = {};

    if (!values.name) {
      nextErrors.name = "Name is required";
    }

    if (!values.email) {
      nextErrors.email = "Email is required";
    }

    if (!values.password) {
      nextErrors.password = "Password is required";
    }

    if (!image) {
      nextErrors.image = "Profile image is required";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
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

    const response = await addUser(formData);

    if (!response) {
      alert("Registration could not be completed.");
      return;
    }

    alert("Registration successful");
    setSet((current) => !current);
    setValues({
      name: "",
      email: "",
      password: "",
    });
    if (fileInput.current) {
      fileInput.current.value = "";
    }
    setImage(null);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Helper>
        Create a client account to submit bookings, track service requests, and
        keep a clearer record of your property activity.
      </Helper>

      <Field>
        Full Name
        <Input
          type="text"
          value={values.name}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              name: event.target.value,
            }))
          }
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </Field>

      <Field>
        Email
        <Input
          type="email"
          value={values.email}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              email: event.target.value,
            }))
          }
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </Field>

      <Field>
        Password
        <Input
          type="password"
          value={values.password}
          onChange={(event) =>
            setValues((current) => ({
              ...current,
              password: event.target.value,
            }))
          }
        />
        {errors.password && <ErrorText>{errors.password}</ErrorText>}
      </Field>

      <Field>
        Profile Image
        <Input
          type="file"
          ref={fileInput}
          onChange={(event) => setImage(event.target.files?.[0] || null)}
        />
        {errors.image && <ErrorText>{errors.image}</ErrorText>}
      </Field>

      <Button type="submit">Create Account</Button>
    </Form>
  );
}

export default SignUpFrom;
