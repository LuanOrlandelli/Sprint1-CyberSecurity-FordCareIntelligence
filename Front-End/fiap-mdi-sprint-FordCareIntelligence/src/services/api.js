import axios from "axios";
import { Platform } from "react-native";
import { getToken } from "../storage/tokenStorage";

const BASE_URL =
  Platform.OS === "web"
    ? "http://localhost:8080"
    : "http://192.168.0.198:8080";


const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;