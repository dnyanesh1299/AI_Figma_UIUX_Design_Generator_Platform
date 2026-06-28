const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch (_error) {
    return {};
  }
}

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {})
    }
  });

  const data = await parseJsonSafe(response);

  if (!response.ok) {
    const error = new Error(data.message ?? "Request failed");
    error.status = response.status;
    throw error;
  }

  return data;
}

export { API_BASE_URL };
