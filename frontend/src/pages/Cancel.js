import { useNavigate } from "react-router-dom";

function Cancel() {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f0f0f0",
      }}
    >
      <h1 style={{ fontSize: "2rem", color: "#333" }}>Payment Failed</h1>
      <p style={{ fontSize: "1.2rem", color: "#666", marginTop: "20px" }}>
        We're sorry, your payment couldn't be processed at this time. This could
        be due to several reasons such as insufficient funds, incorrect payment
        details, or a temporary issue with our payment gateway.
        <ul>
          <li>Please check your payment details and try again.</li>
          <li>
            If the problem persists, try using a different payment method.
          </li>
          <li>Contact our support team for further assistance.</li>
        </ul>
      </p>
      <button
        style={{
          backgroundColor: "#dc3545",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: "5px",
          marginTop: "30px",
        }}
        onClick={() => navigate("/")}
      >
        Try Again
      </button>
    </div>
  );
}

export default Cancel;
