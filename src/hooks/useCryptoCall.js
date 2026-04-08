import { useEffect, useRef } from "react";
import api from "../utils/axiosInstance";

const CALL_INTERVAL = 10 * 1000;
const MAX_DURATION = 5 * 60 * 1000;


export default function useCryptoCall(url, walletAddress) {
  
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!walletAddress || !url) return;

    const callApi = async () => {
      try {
        await api.post(`${url}`);
      } catch (error) {
        console.error("Crypto API error:", error);
      }
    };

    callApi();

    // every 10 sec
    intervalRef.current = setInterval(callApi, CALL_INTERVAL);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }, MAX_DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [walletAddress, url]);
}