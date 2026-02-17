import { useEffect, useState } from "react";
import { deleteVisit, getVisits, updateVisit } from "../api/visitApi";
import styled from "styled-components";

const TableContainer = styled.div`
  width: 80%; /* Set the table width to 80% of the viewport width */
  margin: 0 auto; /* Center the table horizontally */
  margin-top: 4rem;
  margin-bottom: 4rem;
  overflow-x: auto; /* Makes the table scrollable horizontally on small screens */
`;
const BuutonBox = styled.div`
  display: flex;
  gap: 1rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0 auto;
`;

const TableHeader = styled.th`
  background-color: #f2f2f2;
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;
const Button2 = styled.button`
  height: 2rem;
  width: 8rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: white;
  font-weight: 750;
  background-color: red;
  border-radius: 5px;
`;

const Button1 = styled.button`
  height: 2rem;
  width: 8rem;
  cursor: pointer;
  font-size: 1.1rem;
  color: wheat;
  font-weight: 750;
  background-color: green;
  border-radius: 5px;
`;

function Visit() {
  const [visit, setVisit] = useState();
  const [render, setRender] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVisits();
        setVisit(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchData();
  }, [render]);
  async function handleApprove(e, id) {
    e.preventDefault();
    console.log(id);

    await updateVisit(id);
    setRender(!render);
  }
  async function handleReject(e, id) {
    e.preventDefault();

    await deleteVisit(id);
    setRender(!render);
  }
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Product</TableHeader>
            <TableHeader>Visit Date</TableHeader>
            <TableHeader></TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {visit
            ?.slice()
            .reverse()
            .map((el, index) => (
              <TableRow key={el?._id}>
                <TableCell>{el?.user}</TableCell>
                <TableCell>{el?.product}</TableCell>
                <TableCell>{el?.date}</TableCell>
                <TableCell>
                  {!el?.isVisited ? (
                    <BuutonBox>
                      <Button1 onClick={(e) => handleApprove(e, el?._id)}>
                        Approve
                      </Button1>
                      <Button2 onClick={(e) => handleReject(e, el?._id)}>
                        Reject
                      </Button2>
                    </BuutonBox>
                  ) : (
                    <div>You have approved this request</div>
                  )}
                </TableCell>
              </TableRow>
            ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

export default Visit;
