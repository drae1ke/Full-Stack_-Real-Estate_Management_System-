import { apiUrl } from "./client";

function getToken() {
  return JSON.parse(localStorage.getItem("user") || "null")?.token;
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || `Request failed with status ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.data = data;

    console.error("API request failed", {
      method: options.method || "GET",
      path,
      status: response.status,
      message,
      data,
    });

    throw error;
  }

  return data;
}

export function getOverview() {
  return request("/rental/overview");
}

export function getResidentPortal() {
  return request("/rental/me/portal");
}

export function getTenants(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  return request(`/rental/tenants${query ? `?${query}` : ""}`);
}

export function createTenant(payload) {
  return request("/rental/tenants", { method: "POST", body: JSON.stringify(payload) });
}

export function updateTenant(id, payload) {
  return request(`/rental/tenants/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function deleteTenant(id) {
  return request(`/rental/tenants/${id}`, { method: "DELETE" });
}

export function getBookings(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  return request(`/rental/bookings${query ? `?${query}` : ""}`);
}

export function createBooking(payload) {
  return request("/rental/bookings", { method: "POST", body: JSON.stringify(payload) });
}

export function updateBooking(id, payload) {
  return request(`/rental/bookings/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function getPayments(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  return request(`/rental/payments${query ? `?${query}` : ""}`);
}

export function createPayment(payload) {
  return request("/rental/payments", { method: "POST", body: JSON.stringify(payload) });
}

export function createResidentPayment(payload) {
  return request("/rental/me/payments", { method: "POST", body: JSON.stringify(payload) });
}

export function updatePayment(id, payload) {
  return request(`/rental/payments/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}

export function adminInitiateSTKPush(payload) {
  return request("/rental/payments/stk-push", { method: "POST", body: JSON.stringify(payload) });
}

export function residentInitiateSTKPush(payload) {
  return request("/rental/me/stk-push", { method: "POST", body: JSON.stringify(payload) });
}

export function getComplaints(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, value]) => value !== undefined && value !== "")
  ).toString();
  return request(`/rental/complaints${query ? `?${query}` : ""}`);
}

export function createComplaint(payload) {
  return request("/rental/complaints", { method: "POST", body: JSON.stringify(payload) });
}

export function updateComplaint(id, payload) {
  return request(`/rental/complaints/${id}`, { method: "PATCH", body: JSON.stringify(payload) });
}
