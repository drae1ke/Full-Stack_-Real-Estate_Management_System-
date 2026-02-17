import React, { useEffect, useState, useRef } from "react";
import { getProperty } from "../api/propertyApi";
import styled from "styled-components";
import TotalReportComp from "../Components/TotalReportComp";
import AllMedRep from "../Components/AllMedRep";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { getAllOrders } from "../api/orderApi";
import AdminsOrder from "../Components/AdminsOrder";
import Footer from "../Components/Footer/Footer";
import "jspdf-autotable";
import { getOneUser } from "../api/userApi";



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
  gap: 3rem;
  padding: 2rem;
  background:white;
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
  width: 5rem; /* Fixed width */
  height: 5rem; /* Fixed height */
  overflow: hidden; /* Prevents the image from overflowing the cell */
  object-fit: contain; /* Ensures the image maintains its aspect ratio */
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
  top: 100%; // Position it just below the CustomH1
  left: 0;
  width: 15rem;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px;
  z-index: 1; // Ensure it's above other elements
`;

const StyledTh = styled.th`
  background-color: #f2f2f2; /* Light grey background */
  padding: 10px; /* Padding around the text */
  text-align: left; /* Align text to the left */
`;
const StyledTbody = styled.tbody`
  background-color: #ffffff; /* White background */
`;
const ProductImage = styled.img`
  width: 100%; // Makes the image take the full width of the cell
  height: 100%; // Maintains the aspect ratio of the image
  //object-fit: cover; // Ensures the image covers the entire cell without distortion
`;

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [filterOption, setFilterOption] = useState("All");
  const parentContainerRef = useRef(null);
  const [newOrder, setNewOrder] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllOrders();
        setOrders(response);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  const totalSellMoney = newOrder.reduce(
    (acc, order) => acc + order.sellMoney,
    0
  );

  const filterOrdersByDate = (orders, filterOption) => {
    if (filterOption === "All") {
      return orders;
    }
    const today = new Date();
    let startDate;

    switch (filterOption) {
      case "1 week":
        startDate = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() - 7
        );
        break;

      case "1 month":
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        break;

      case "1 year":
        startDate = new Date(
          today.getFullYear() - 1,
          today.getMonth(),
          today.getDate()
        );
        break;
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
      case "2 months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        break;
      case "6 months":
        startDate = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        break;
      default:
        return orders;
    }

    return orders.filter((order) => new Date(order.date) >= startDate);
  };

  useEffect(() => {
    const filteredOrders = filterOrdersByDate(orders, filterOption);
    setNewOrder(filteredOrders);
  }, [orders, filterOption]);

  //console.log(newOrder);
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const tableColumn = [
      "Buyer",
      "Property Name",
      "Date",
      "Sell Money",
      "Address",
    ];

    async function nameRep(userId) {
      const response = await getOneUser(userId);
      //console.log(response);
      return response.name;
    }

    function date(dateString) {
      // Extract the date part before the 'T'
      const indexOfT = dateString.indexOf("T");
      const datePart = dateString.substring(0, indexOfT); // Date

      // Extract the time part after the 'T'
      const timePart = dateString.substring(indexOfT + 1);
      const indexOfDot = timePart.indexOf(".");
      const timeWithoutSeconds = timePart.substring(0, indexOfDot); // The whole hour and minute

      // Extract the hour and minute parts
      const lastHourIndex = timeWithoutSeconds.indexOf(":");
      const hourPart = timeWithoutSeconds.substring(0, lastHourIndex); // Hour in String
      const minutePart = timeWithoutSeconds.substring(lastHourIndex + 1);

      // Convert the hour part to a number and adjust for Bangladesh time (UTC+6)
      let hour = Number(hourPart);
      hour += 6;
      if (hour >= 24) {
        hour -= 24; // Adjust for overflow
      }

      // Determine AM/PM and format the hour
      let ampm = hour >= 12 ? "pm" : "am";
      let formattedHour = hour >= 12 ? hour % 12 || 12 : hour;

      // Return the formatted date and time
      return `${datePart} at ${formattedHour}:${minutePart} ${ampm}`;
    }

    // Use Promise.all to wait for all promises to resolve
    const tableDataPromises = newOrder
      ?.slice()
      .reverse()
      .map(async (order) => [
        await nameRep(order.userId),
        order?.property.map((el) => el?.name),
        date(order?.date),
        `${order?.sellMoney}`,
        `${order?.address}`,
      ]);

    doc.setFontSize(25); // Smaller font size for the header
    doc.setFont("Arial", "bold");
    doc.text(`L’Espace`, 10, 10);
    doc.setFontSize(15);
    doc.text(`Total income: ${totalSellMoney}`, 10, 30);
    doc.text(`${filterOption} sell report`, 10, 20);

    Promise.all(tableDataPromises)
      .then((tableData) => {
        doc.autoTable({
          head: [tableColumn],
          body: tableData,
          margin: { top: 40, bottom: 0 },
          theme: "grid",
          styles: { overflow: "linebreak" },
        });
        doc.save("Revenue_Report.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      });
  };

  return (
    <ParentContainer ref={parentContainerRef}>
      <HeaderContainer>
        <CustomH1>Dashboard</CustomH1>
        <Button onClick={handleDownloadPDF}>Download Report</Button>
        <DropdownMenu
          value={filterOption}
          onChange={(e) => {
            if (e.target.value === "Show All") {
              setFilterOption("All"); // Assuming "all" represents all orders
            } else {
              setFilterOption(e.target.value);
            }
          }}
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
      <TotalSellAmount>Total Sell: {totalSellMoney}</TotalSellAmount>
      <TotalReportComp orders={orders} />
      <AllOrder newOrder={newOrder} newSetOrder={setNewOrder} />
    </ParentContainer>
  );
}
function AllOrder({ newOrder: orders, newSetOrder: setNewOrder }) {
  console.log(orders);
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
                <ProductImage
                  src={`http://localhost:8080/images/${order?.image}`}
                  alt="Order"
                />
              </StyledTd>
              <StyledTd>
                <Name userId={order?.userId} />
              </StyledTd>
              <StyledTd>{order?.property.map((el) => el?.name)}</StyledTd>
              <StyledTd>
                <DateFn dateString={order?.date} />
              </StyledTd>
              <StyledTd>{order?.sellMoney}</StyledTd>
              <StyledTd>{order?.address}</StyledTd>
            </StyledTr>
          ))}
      </StyledTbody>
    </StyledTable>
  );
}

function Name({ userId }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOneUser(userId);
        setUser(response);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);
  return user?.name;
}

function DateFn({ dateString }) {
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

export default Dashboard;
