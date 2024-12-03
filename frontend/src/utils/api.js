import axios from 'axios';
const backendUrl = process.env.REACT_APP_BACKEND;

const API = axios.create({
  baseURL: `${backendUrl}`,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
