import axios from 'axios';

const API = axios.create({
    // REMOVE '/api' from the base URL here.
    // The correct production URL is just the Render domain: https://mini-blog-backend-q5sq.onrender.com
    // The correct local URL is just the port: http://localhost:8080
    baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : 'http://localhost:8080'
});

// attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
  return config;
});

export default API;