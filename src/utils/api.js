import api from "./axiosInstance";

export const apiRequest = async (url, payload = {}) => {
  try {
    const response = await api.post(url, payload);
    return { data: response.data, error: null };
  } catch (error) {
    console.error("API Error:", error);
    return { data: null, error: error.message || "Something went wrong" };
  }
};