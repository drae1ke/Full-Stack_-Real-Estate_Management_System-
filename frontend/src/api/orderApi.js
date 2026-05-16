import { apiUrl } from "./client";

export async function getAllOrders() {
  const token = JSON.parse(localStorage.getItem("user")).token;
  try {
    const response = await fetch(apiUrl("/orders"), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}

export async function updateOneOrder(id) {
  console.log(id);
  const token = JSON.parse(localStorage.getItem("user")).token;
  try {
    const response = await fetch(apiUrl(`/orders/${id}`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status: true,
      }),
    });
    const data = await response.json();
    //console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
}
