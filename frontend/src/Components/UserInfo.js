import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  min-height: 10rem;
  width: 75%;
  padding: 1rem;
  background-color: rgba(
    144,
    238,
    144,
    0.3
  ); /* Light green transparent background */
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); /* Shadow effect */
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 70%;
`;

const PicContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 17%;
  border-radius: 1000px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); /* Shadow effect */
`;

const Name = styled.div`
  font-size: 2.5rem;
  font-weight: 750;
  color: #00008b; /* Dark blue */
`;

const Email = styled.div`
  font-size: 1.7rem;
  font-weight: 750;
  color: #008000; /* Bright green */
`;

const Number = styled.div`
  font-size: 1rem;
  font-weight: 750;
  color: #8b0000;
`;

const Image = styled.img`
  object-fit: cover;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  border-radius: 1000px;
`;

function UserInfo({ user }) {
  return (
    <Container>
      <InfoContainer>
        <Name>{user?.name}</Name>
        <Email>{user?.email}</Email>
        <Number>Mobile Number: {user?.mobileNumber}</Number>
      </InfoContainer>
      <PicContainer>
        <Image src={`http://localhost:8080/images/${user?.image}`} alt="User" />
      </PicContainer>
    </Container>
  );
}

export default UserInfo;
