const API_BASE_URL = "http://127.0.0.1:8000";

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const refreshToken = async () => {
  const refresh = getRefreshToken();

  if (!refresh) {
    logoutUser();
    return null;
  }

  const response = await fetch(`${API_BASE_URL}/api/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    logoutUser(); // Log out if refresh fails
    return null;
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
};

export const logoutUser = async () => {
    const refreshToken = localStorage.getItem("refresh_token");
  
    if (refreshToken) {
      await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    }
  
    // Clear tokens & redirect to login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/";
  };

export const apiRequest = async (url, options = {}) => {
  let access = getAccessToken();

  if (!access) {
    access = await refreshToken(); // Try refreshing token if missing
    if (!access) return null;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
      Authorization: `Bearer ${access}`,
    },
  });

  if (response.status === 401) {
    access = await refreshToken();
    if (!access) return null;

    // Retry request with new access token
    return fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...options.headers,
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    });
  }

  return response;
};
