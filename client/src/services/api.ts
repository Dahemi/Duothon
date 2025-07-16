import axios from "axios";
import { auth } from "../firebase";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Add request interceptor to include Firebase token
API.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("Error getting Firebase token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
