import { useEffect, useState } from "react";
import styled from "styled-components";
import FetchCustomerNameForAdminOrder from "./FetchCustomerNameForAdminOrder";
import { updateOneOrder } from "../api/orderApi";

const TableContainer = styled.div`
  width: 100%;
  margin-top: 3rem;
  text-align: center; // Ensure the container is centered
`;

const Table = styled.table`
  margin-left: auto;
  margin-right: auto;
  width: 90%; // Adjust the width as needed
  //max-width: 1200px; // Optional: Set a maximum width
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
            .map((el, index) => (
              <TableRow key={el?._id} data-index={index}>
                <TableCell>
                  <ProductImage
                    src={`http://localhost:8080/images/${el?.image}`}
                    alt={el?.name}
                  />
                </TableCell>
                <TableCell>
                  {FetchCustomerNameForAdminOrder(el?.userId)}
                </TableCell>
                <TableCell>{Name(el?.property)}</TableCell>
                <TableCell>{el?.sellMoney} Taka</TableCell>
                <TableCell>{el?.address}</TableCell>
                <TableCell>{Date(el?.date)}</TableCell>
              </TableRow>
            ))}
        </tbody>
      </Table>
    </TableContainer>
  );
}

function Name(property) {
  console.log(property);
  const prop = property?.map((el) => {
    return `${el?.name}`;
  });

  return prop;
}

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
  const orderDate = ` ${date} `;
  const orderTime = ` ${hours}:${min} ${ampm}`;

  return `${orderDate} at ${orderTime}`;
}

export default AdminsOrder;
