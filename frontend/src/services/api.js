const BASE_URL = import.meta.env.DEV
  ? "/api"
  : (import.meta.env.VITE_API_URL || "/api");

async function request(path, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed: ${response.status}`
      );
    }

    return data;
  } catch (error) {
    console.error(`API Error: ${path}`, error);
    throw error;
  }
}

export const api = {
  dashboard: {
    get: () => request("/dashboard"),
  },

  patients: {
    list: (search = "") =>
      request(
        `/patients${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`
      ),

    create: (data) =>
      request("/patients", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      request(`/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    remove: (id) =>
      request(`/patients/${id}`, {
        method: "DELETE",
      }),
  },

  doctors: {
    list: (search = "") =>
      request(
        `/doctors${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`
      ),

    create: (data) =>
      request("/doctors", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      request(`/doctors/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    remove: (id) =>
      request(`/doctors/${id}`, {
        method: "DELETE",
      }),
  },

  appointments: {
    list: (search = "") =>
      request(
        `/appointments${
          search ? `?search=${encodeURIComponent(search)}` : ""
        }`
      ),

    create: (data) =>
      request("/appointments", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    update: (id, data) =>
      request(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    remove: (id) =>
      request(`/appointments/${id}`, {
        method: "DELETE",
      }),
  },

  invoices: {
    list: () => request("/invoices"),

    create: (data) =>
      request("/invoices", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    markPaid: (id) =>
      request(`/invoices/${id}/paid`, {
        method: "PUT",
      }),
  },
};