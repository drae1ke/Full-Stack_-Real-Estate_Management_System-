import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { getAllOrders } from "../api/orderApi";
import { getOneUser } from "../api/userApi";
import { imageUrl } from "../api/client";
import {
  formatKenyanCurrency,
  formatKenyanDateTime,
} from "../utils/formatters";
import { BRAND_NAME } from "../utils/siteContent";

const HeaderContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem;
`;

const ParentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2rem;
  background: white;
`;

const Button = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  height: 3rem;
  width: 13rem;
  font-weight: 700;
  font-size: 1rem;
  background-color: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const SummaryCard = styled.div`
  width: 100%;
  background: #eef7f0;
  border: 1px solid #d7e0d9;
  border-radius: 16px;
  padding: 1.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const StyledThead = styled.thead`
  background-color: #f2f2f2;
`;

const StyledTr = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const StyledTd = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
  width: 5rem;
  height: 5rem;
  overflow: hidden;
`;

const CustomH1 = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  color: #666666;
  margin-top: 1rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const TotalSellAmount = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 1rem;
`;

const DropdownMenu = styled.select`
  top: 100%;
  left: 0;
  width: 15rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  z-index: 1;
`;

const StyledTh = styled.th`
  background-color: #f2f2f2;
  padding: 10px;
  text-align: left;
`;

const StyledTbody = styled.tbody`
  background-color: #ffffff;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filterOption, setFilterOption] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllOrders();
        setOrders(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  const filteredOrders = useMemo(() => {
    if (filterOption === "All") {
      return orders;
    }

    const today = new Date();
    let startDate;

    switch (filterOption) {
      case "Today":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );
        break;
      case "3 days":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 3
        );
        break;
      case "1 week":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        break;
      case "2 weeks":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 14
        );
        break;
      case "3 weeks":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 21
        );
        break;
      case "1 month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        break;
      case "2 months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        break;
      case "6 months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        break;
      case "1 year":
        startDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        break;
      default:
        return orders;
    }

    return orders.filter((order) => new Date(order.date) >= startDate);
  }, [filterOption, orders]);

  const totalSellMoney = filteredOrders.reduce(
    (accumulator, order) => accumulator + Number(order.sellMoney || 0),
    0
  );

  const handleDownloadPDF = async () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Buyer",
      "Property Name",
      "Date",
      "Sell Money",
      "Address",
    ];

    const tableData = await Promise.all(
      filteredOrders
        .slice()
        .reverse()
        .map(async (order) => {
          const response = await getOneUser(order.userId);
          return [
            response?.name || "Unknown customer",
            order?.property?.map((item) => item?.name).join(", "),
            formatKenyanDateTime(order?.date),
            formatKenyanCurrency(order?.sellMoney),
            order?.address || "",
          ];
        })
    );

    doc.setFontSize(25);
    doc.setFont("Arial", "bold");
    doc.text(BRAND_NAME, 10, 10);
    doc.setFontSize(15);
    doc.text(`${filterOption} sales report`, 10, 20);
    doc.text(`Total income: ${formatKenyanCurrency(totalSellMoney)}`, 10, 30);

    doc.autoTable({
      head: [tableColumn],
      body: tableData,
      margin: { top: 40, bottom: 0 },
      theme: "grid",
      styles: { overflow: "linebreak" },
    });

    doc.save("Revenue_Report.pdf");
  };

  return (
    <ParentContainer>
      <HeaderContainer>
        <CustomH1>Dashboard</CustomH1>
        <Button onClick={handleDownloadPDF}>Download Report</Button>
        <DropdownMenu
          value={filterOption}
          onChange={(event) => setFilterOption(event.target.value)}
        >
          <option value="All">Show All</option>
          <option value="Today">Today</option>
          <option value="3 days">3 Day</option>
          <option value="1 week">1 Week</option>
          <option value="2 weeks">2 Weeks</option>
          <option value="3 weeks">3 Weeks</option>
          <option value="1 month">1 Month</option>
          <option value="2 months">2 Month</option>
          <option value="6 months">6 Month</option>
          <option value="1 year">1 Year</option>
        </DropdownMenu>
      </HeaderContainer>

      <SummaryCard>
        <TotalSellAmount>
          Total Sell: {formatKenyanCurrency(totalSellMoney)}
        </TotalSellAmount>
      </SummaryCard>

      <OrdersTable orders={filteredOrders} />
    </ParentContainer>
  );
}

function OrdersTable({ orders }) {
  return (
    <StyledTable>
      <StyledThead>
        <StyledTr>
          <StyledTh>Image</StyledTh>
          <StyledTh>Buyer</StyledTh>
          <StyledTh>Property Name</StyledTh>
          <StyledTh>Date</StyledTh>
          <StyledTh>Sell Money</StyledTh>
          <StyledTh>Address</StyledTh>
        </StyledTr>
      </StyledThead>
      <StyledTbody>
        {orders
          ?.slice()
          .reverse()
          .map((order) => (
            <StyledTr key={order._id}>
              <StyledTd>
                <ProductImage src={imageUrl(order?.image)} alt="Order" />
              </StyledTd>
              <StyledTd>
                <CustomerName userId={order?.userId} />
              </StyledTd>
              <StyledTd>
                {order?.property?.map((item) => item?.name).join(", ")}
              </StyledTd>
              <StyledTd>{formatKenyanDateTime(order?.date)}</StyledTd>
              <StyledTd>{formatKenyanCurrency(order?.sellMoney)}</StyledTd>
              <StyledTd>{order?.address}</StyledTd>
            </StyledTr>
          ))}
      </StyledTbody>
    </StyledTable>
  );
}

function CustomerName({ userId }) {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOneUser(userId);
        setUserName(response?.name || "");
      } catch (error) {
        console.error("Error", error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  return userName || "Unknown customer";
}

export default Dashboard;
