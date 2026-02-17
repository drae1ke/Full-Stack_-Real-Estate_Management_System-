import { useEffect, useState } from "react";
import { getAllOrders } from "../api/orderApi";
import AdminsOrder from "../Components/AdminsOrder";

function AdminOrder() {
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllOrders();
        setOrder(response);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <div>
        <h1>Orders</h1>
      </div>
      <AdminsOrder order={order} setOrder={setOrder} />
    </div>
  );
}

export default AdminOrder;
