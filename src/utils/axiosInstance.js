import axios from "axios";
import { encryptPayload, decryptResponse } from "./crypto";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("userToken");

    if (token) {
      config.data = {
        ...config.data,
        token,
      };
    }

    if (config.data) {
      const encrypted = await encryptPayload(config.data);
      config.data = { data: encrypted };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => {
    try {
      const decrypted = decryptResponse(response?.data);
      const parsedData = JSON.parse(decrypted);
      // console.log("parsedData", parsedData)
      response.data = parsedData;

      return response;
    } catch (err) {
      console.error("Decryption failed:", err);
      return response;
    }
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("userToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;