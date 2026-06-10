const _RAW_API_BASE = process.env.REACT_APP_API_URL;
const API_BASE_URL = (
  _RAW_API_BASE && _RAW_API_BASE !== "undefined" ? _RAW_API_BASE : ""
).replace(/\/$/, "");

export function apiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function imageUrl(imageName) {
  return imageName ? apiUrl(`/images/${imageName}`) : "";
}
