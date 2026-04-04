import axios from "axios";
import { encryptPayload, decryptResponse } from "./crypto";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // headers: { "Content-Type": "application/json" },
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
      console.log("data", config.data)
      console.log("encrypted", encrypted);
      config.data = { data: encrypted };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  async (response) => {
    console.log("Raw response.data:", response.data);
    console.log("response.data.data:", response.data?.data);
    console.log("typeof:", typeof response.data?.data);
    if (response.data?.data) {
      response.data = await decryptResponse(response.data.data);
    }
    return response;
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

// token 
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("userToken");
//   if (!token) return config;

//   //  GET request
//   if (config.method === "get") {
//     config.params = {
//       ...config.params,
//       token,
//     };
//   }
//   //  FormData
//   else if (config.data instanceof FormData) {
//     config.data.append("token", token);
//   }
//   //  JSON
//   else if (config.data && typeof config.data === "object") {
//     config.data = {
//       ...config.data,
//       token,
//     };
//   }
//   //  No data
//   else {
//     config.data = { token };
//   }

//   return config;
// });