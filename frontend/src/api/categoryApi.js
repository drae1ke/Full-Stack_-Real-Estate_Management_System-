export async function getCategories() {
  const response = await fetch("http://localhost:8080/category");
  const data = await response.json();
  return data;
}

export async function getCategoryById(id) {
  const response = await fetch(`http://localhost:8080/category/${id}`);
  const data = await response.json();
  return data;
}

export async function deleteCategory(id) {
  const res = await fetch(`http://localhost:8080/category/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(`Category could not be deleted:`);
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function addCategory(category) {
  console.log(category);
  try {
    const response = await fetch("http://localhost:8080/category", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Make sure to set the content type
      },
      body: JSON.stringify(category), // Stringify your object to send as JSON
    });

    if (!response.ok) {
      throw new Error(`Category could not be created: ${response.statusText}`);
    }

    const data = await response.json();
    //console.log(data);
    return data;
  } catch (error) {
    alert("This category already exists");
    console.error(error);
  }
}

// api.js
export async function updateCategory(id, updatedName) {
  const response = await fetch(`http://localhost:8080/category/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ category: updatedName }),
  });

  if (!response.ok) {
    throw new Error(`Category could not be updated: ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}
