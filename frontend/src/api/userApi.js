export async function addUser(formData) {
  try {
    const response = await fetch("http://localhost:8080/auth/signup", {
      method: "POST",
      body: formData, // Send FormData directly
    });

    if (!response.ok) {
      const error = await response.json();
      console.log(error.message);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.log(error);
  }
}

// Function to send a request to the /users route
export async function fetchUsers() {
  try {
    const user = JSON.parse(localStorage.getItem("user"));
    //const user = localStorage.getItem("user");
    const token = JSON.parse(localStorage.getItem("user")).token;
    const response = await fetch("http://localhost:8080/users/getUser", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user: user,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

export async function getOneUser(id) {
  //console.log(id);
  const token = JSON.parse(localStorage.getItem("user")).token;
  try {
    const response = await fetch(`http://localhost:8080/users/${id}`, {
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
