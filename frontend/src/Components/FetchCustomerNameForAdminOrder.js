import { useEffect, useState } from "react";
import { getOneUser } from "../api/userApi";

function FetchCustomerNameForAdminOrder(userId) {
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

export default FetchCustomerNameForAdminOrder;
