import axios from "axios";

const api = axios.create({
  // baseURL: "http://192.168.0.212:8080/api",
  baseURL: "http://localhost:8080/api",
  withCredentials: true, // optional (if cookies later)
});

// 🔥 Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
