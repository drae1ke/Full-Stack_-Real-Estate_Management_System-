export async function getVisits() {
  const response = await fetch("http://localhost:8080/visit");
  const data = await response.json();
  return data;
}

export async function addVisit(visit) {
  console.log(visit);
  try {
    const response = await fetch("http://localhost:8080/visit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(visit),
    });

    if (!response.ok) {
      throw new Error(`Visit could not be created: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    alert("There is an error");
    console.error(error);
  }
}

export async function getOnePropetyVisitDate(visit) {
  try {
    const response = await fetch("http://localhost:8080/visit/get", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ visit }),
    });

    if (!response.ok) {
      throw new Error(`Visit could not be created: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    alert("There is an error");
    console.error(error);
  }
}

export async function updateVisit(id) {
  const response = await fetch(`http://localhost:8080/visit/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isVisited: true }),
  });

  if (!response.ok) {
    throw new Error(`Visit could not be updated: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}

export async function deleteVisit(id) {
  const res = await fetch(`http://localhost:8080/visit/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Category could not be deleted:`);
  }
  const data = await res.json();
  console.log(data);
  return data;
}
