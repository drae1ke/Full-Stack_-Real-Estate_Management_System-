const API_BASE_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8080"
).replace(/\/$/, "");

export function apiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function imageUrl(imageName) {
  return imageName ? apiUrl(`/images/${imageName}`) : "";
}
