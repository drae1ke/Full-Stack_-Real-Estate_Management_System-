import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Styled Components
const TableContainer = styled.div`
  width: 80%; /* Set the table width to 80% of the viewport width */
  margin: 0 auto; /* Center the table horizontally */
  overflow-x: auto; /* Makes the table scrollable horizontally on small screens */
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

// UsersOrder Component
function UsersOrder({ order }) {
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <TableRow>
            <TableHeader>Name</TableHeader>
            <TableHeader>Address</TableHeader>
            <TableHeader>Time</TableHeader>
          </TableRow>
        </thead>
        <tbody>
          {order
            ?.slice()
            .reverse()
            .map((el, index) => (
              <TableRow key={el?._id}>
                <TableCell>{Name(el?.property)}</TableCell>
                <TableCell>{el?.address}</TableCell>
                <TableCell>{Date(el?.date)}</TableCell>
              </TableRow>
            ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

// Name Function
function Name(property) {
  console.log(property);
  const medArr = property?.map((el) => {
    return `${el?.name}`;
  });

  const name = medArr.join(", ");
  return <div>{name}</div>;
}

// Date Function
function Date(dateString) {
  const [ampm, setAmpm] = useState("am");
  const [hours, setHour] = useState("");
  const [date, setDate] = useState("");
  const [min, setMin] = useState("");

  useEffect(() => {
    const indexOfT = dateString.indexOf("T");
    const result = dateString.substring(0, indexOfT); // Date
    setDate(result);
    const time = dateString.substring(indexOfT + 1);
    const indexOfDot = time.indexOf(".");
    const result2 = time.substring(0, indexOfDot); // The whole hour, min and sec
    const lastHourIndex = result2.indexOf(":");
    const result3 = result2.substring(0, lastHourIndex); // Hour in String
    const result4 = result2.substring(lastHourIndex + 1);
    setMin(result4);
    let hour = Number(result3);
    // Adjust for Bangladesh time (UTC+6)
    hour += 6;
    if (hour >= 24) {
      hour -= 24; // Adjust for overflow
    }
    if (hour >= 12) {
      setAmpm("pm");
      setHour(String(hour % 12 || 12)); // Correctly handle 12 PM
    } else {
      setHour(String(hour));
    }
  }, [dateString]);
  const orderDate = `${date} `;
  const orderTime = `${hours}:${min} ${ampm}`;

  return `${orderDate}, ${orderTime}`;
}

export default UsersOrder;
