import { useEffect, useState } from "react";
import styled from "styled-components";
import { getOneUser } from "../api/userApi";
import { imageUrl } from "../api/client";
import {
  formatKenyanCurrency,
  formatKenyanDateTime,
} from "../utils/formatters";

const TableContainer = styled.div`
  width: 100%;
  margin-top: 3rem;
  text-align: center;
`;

const Table = styled.table`
  margin-left: auto;
  margin-right: auto;
  width: 90%;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  text-align: left;
  height: 5rem;
  width: 5rem;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TableHeaderCell = styled.th`
  padding: 10px;
  text-align: left;
  background-color: #4caf50;
  color: white;
`;

function AdminsOrder({ order }) {
  return (
    <TableContainer>
      <Table>
        <thead>
          <tr>
            <TableHeaderCell>Image</TableHeaderCell>
            <TableHeaderCell>Buyer</TableHeaderCell>
            <TableHeaderCell>Property Name</TableHeaderCell>
            <TableHeaderCell>Sell Money</TableHeaderCell>
            <TableHeaderCell>Address</TableHeaderCell>
            <TableHeaderCell>Date</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {order
            ?.slice()
            .reverse()
            .map((item) => (
              <TableRow key={item?._id}>
                <TableCell>
                  <ProductImage src={imageUrl(item?.image)} alt={item?.name} />
                </TableCell>
                <TableCell>
                  <CustomerName userId={item?.userId} />
                </TableCell>
                <TableCell>{propertyNames(item?.property)}</TableCell>
                <TableCell>{formatKenyanCurrency(item?.sellMoney)}</TableCell>
                <TableCell>{item?.address}</TableCell>
                <TableCell>{formatKenyanDateTime(item?.date)}</TableCell>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

function propertyNames(property = []) {
  return property.map((item) => item?.name).join(", ");
}

function CustomerName({ userId }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await getOneUser(userId);
        setUserName(response?.name || "");
      } catch (error) {
        console.error("Error fetching customer name:", error);
      }
    };

    if (userId) {
      fetchUserName();
    }
  }, [userId]);

  return userName || "Unknown customer";
}

export default AdminsOrder;
