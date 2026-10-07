const BASE = import.meta.env.VITE_API_URL || "";

// One small helper for all backend calls. It adds the login token automatically.
export async function api(path, method = "GET", body) {
  const token = localStorage.getItem("token");

  let res;
  try {
    res = await fetch(BASE + "/api" + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: "Bearer " + token }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  // Read as text first, because a failed request can return an empty or HTML body
  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    throw new Error("The server sent an unexpected reply. Please try again.");
  }

  // 401 means the login expired or is invalid: clear it and go back to the home page
  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/";
  }

  if (!res.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.data = data; // lets the caller read extra fields from the server's reply
    throw error;
  }
  return data;
}