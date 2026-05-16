import React from "react";
import styled from "styled-components";
import { formatKenyanDateTime } from "../utils/formatters";

const TableContainer = styled.div`
  width: 80%;
  margin: 0 auto;
  overflow-x: auto;
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
            .map((item) => (
              <TableRow key={item?._id}>
                <TableCell>{propertyNames(item?.property)}</TableCell>
                <TableCell>{item?.address}</TableCell>
                <TableCell>{formatKenyanDateTime(item?.date)}</TableCell>
              </TableRow>
            ))}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
}

function propertyNames(property = []) {
  return property.map((item) => item?.name).join(", ");
}

export default UsersOrder;
