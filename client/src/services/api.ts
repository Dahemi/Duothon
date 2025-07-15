// src/services/api.ts
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // or use import.meta.env.VITE_API_URL
});

export default API;
