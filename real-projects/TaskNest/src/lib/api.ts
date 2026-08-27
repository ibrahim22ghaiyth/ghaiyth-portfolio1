import axios from "axios";
import { useAuthStore } from "../store/useAuthStore";

// API base URL is configurable for deployment.
// Falls back to the local dev server when no env var is set.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
