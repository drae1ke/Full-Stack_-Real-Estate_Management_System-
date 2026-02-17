export async function addSupply(supply) {
  try {
    const response = await fetch("http://localhost:8080/supply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supply),
    });

    if (!response.ok) {
      throw new Error(`Supply could not be created: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getSupplies() {
  const response = await fetch("http://localhost:8080/supply");
  const data = await response.json();
  return data;
}

export async function updateSupply(sup) {
  console.log(sup);
  try {
    const response = await fetch("http://localhost:8080/supply/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Make sure to set the content type
      },
      body: JSON.stringify(sup), // Stringify your object to send as JSON
    });

    if (!response.ok) {
      throw new Error(`Could not supply: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    alert("Could not supply");
    console.error(error);
  }
}
