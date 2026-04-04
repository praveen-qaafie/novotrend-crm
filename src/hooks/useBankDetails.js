import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import api from "../utils/axiosInstance";

const useBankDetails = (url, options = {}, autoFetch = true) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const stringifiedOptions = JSON.stringify(options);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // const response = await api.get(url, options);
      const response = await api({
        url,
        method: options?.method || "GET",
        data: options?.data || {},
        params: options?.params || {},
      });
      setData(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, stringifiedOptions]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return { data, loading, error, refetch: fetchData };
};

export default useBankDetails;
