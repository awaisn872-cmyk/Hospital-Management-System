const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  dashboard: () => request("/dashboard"),

  patients: {
    list: (q = "") => request(`/patients${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    create: (data) => request("/patients", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/patients/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/patients/${id}`, { method: "DELETE" })
  },

  doctors: {
    list: (q = "") => request(`/doctors${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    create: (data) => request("/doctors", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/doctors/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/doctors/${id}`, { method: "DELETE" })
  },

  appointments: {
    list: (q = "") => request(`/appointments${q ? `?q=${encodeURIComponent(q)}` : ""}`),
    create: (data) => request("/appointments", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/appointments/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id) => request(`/appointments/${id}`, { method: "DELETE" })
  },

  invoices: {
    list: () => request("/invoices"),
    create: (data) => request("/invoices", { method: "POST", body: JSON.stringify(data) })
  }
};