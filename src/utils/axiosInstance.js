import axios from "axios";
import { encryptPayload, decryptResponse } from "./crypto";

const api = axios.create({
  baseURL: "https://ntapi.novotrend.co/member/login/login.php",
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
      config.data = { data: encrypted };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  async (response) => {
    const decryptedData = decryptResponse(response?.data);
    const parsedData = JSON.parse(decryptedData);

    //  Praveen Return the Parsed Data instead of response. Check the console
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
