import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function Success() {
  const [date, setDate] = useState();
  const propertyRef = useRef(null);
  const navigate = useNavigate();
  const pay = JSON.parse(localStorage.getItem("Payed"));
  console.log(pay);
  const properties = pay?.order?.property;

  const downloadInvoice = async () => {
    const doc = new jsPDF();
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

    const tableColumn = ["Field", "Value"];
    const tableData = [
      ["Property Name: ", `${properties[0].name}`],
      ["Address: ", `${pay?.order?.address}`],
      ["Price: ", `${pay?.order?.sellMoney}`],
      ["Date: ", `${date(pay?.order?.date)}`],
    ];
    doc.setFontSize(25); // Smaller font size for the header
    doc.setFont("Arial", "bold");
    doc.text(`L’Espace`, 10, 10);
    doc.autoTable({
      head: [tableColumn],
      body: tableData,
      margin: { top: 20, bottom: 0 },
      theme: "grid",
      styles: { overflow: "linebreak" },
    });

    doc.save("Invoice.pdf");
  };

  return (
    <div
      ref={propertyRef}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "600px", // Adjusted height
        backgroundColor: "#f0f0f0",
        width: "210mm", // Adjusted width to match A4 size
        margin: "auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", color: "#333" }}>Congratulations!</h1>
      <p style={{ fontSize: "1.2rem", color: "#666", marginTop: "20px" }}>
        You Successfully purchased this property.
      </p>
      <div>
        {properties &&
          properties.map((property, index) => (
            <div
              className="prop"
              key={index}
              id={`property-${property.id}`} // Unique ID for each property
              style={{
                marginBottom: "20px",
                width: "200px", // Adjusted width to fit within A4 size
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <img
                src={`http://localhost:8080/images/${pay?.order?.image}`}
                alt={property.name}
                style={{ width: "100%", height: "auto", marginBottom: "10px" }}
              />
              <h3>{property.name}</h3>
              <p>Address: {pay?.order?.address}</p>
              <p>Price: {pay?.order?.sellMoney} Taka</p>
              <p>
                Time: <DateFn dateString={pay?.order?.date} setDate={setDate} />
              </p>
            </div>
          ))}
        <button
          style={{
            backgroundColor: "green",
            color: "#fff",
            padding: "10px 20px",
            borderRadius: "5px",
            marginBottom: "30px",
          }}
          onClick={downloadInvoice}
        >
          Download Invoice
        </button>
      </div>
      <ul>
        <li>Your properties are now under your name.</li>
        <li>Enjoy your new spaces and make them your own.</li>
        <li>
          For any inquiries or assistance, please contact our support team.
        </li>
      </ul>
      <button
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          marginTop: "30px",
        }}
        onClick={() => navigate("/")}
      >
        Explore Our Page
      </button>
    </div>
  );
}

function DateFn({ dateString, setDate: set }) {
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
  set(`${orderDate} at ${orderTime}`);
  return `${orderDate} at ${orderTime}`;
}

export default Success;
