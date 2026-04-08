import { useEffect, useState } from "react";
import api from "../utils/axiosInstance";
import { AUTH_API } from "../utils/constants";

const useCountry = () => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCountry = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`${AUTH_API.GET_COUNTRY}`);
      setCountries(res?.data?.data?.response || []);
    } catch (err) {
      console.error("Error fetching countries:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCountry();
  }, []);

  return {
    data: countries,
    isLoading,
    error,
    refetch: getCountry,
  };
};

export default useCountry;