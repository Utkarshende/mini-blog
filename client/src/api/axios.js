import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL, 
    withCredentials: true
});

// Attach token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
  return config;
});

export default API;
