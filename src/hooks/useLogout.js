import { useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import api from "../utils/axiosInstance";
import { AUTH_API } from "../utils/constants";

const useLogoutHandler = () => {
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const lastSavedRef = useRef(0);

  const { clearCache } = useUserContext();

  // Logout function
  // const handleLogOut = useCallback(async () => {
  //   try {
  //     const token = localStorage.getItem("userToken");

  //     if (token) {
  //       await api.post(`${AUTH_API.LOG_OUT}`);
  //     }
  //   } catch (err) {
  //     console.error("Logout failed", err);
  //   } finally {
  //     clearCache();
  //     localStorage.clear();
  //     localStorage.setItem("logout-event", Date.now().toString());
  //     navigate("/login");
  //   }
  // }, [navigate, clearCache]);

  const handleLogOut = useCallback(async () => {
    try {
      await api.post(AUTH_API.LOG_OUT);
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearCache();
      localStorage.clear();
      localStorage.setItem("logout-event", Date.now().toString());
      navigate("/login");
    }
  }, [navigate, clearCache]);
  // Reset inactivity timer
  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(
      () => {
        handleLogOut();
      },
      10 * 60 * 1000,
    );
  }, [handleLogOut]);

  // Save last activity (throttled)
  const saveLastActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastSavedRef.current > 1000) {
      // throttle: 1 second
      localStorage.setItem("lastActivity", now.toString());
      lastSavedRef.current = now;
    }
    resetTimer();
  }, [resetTimer]);

  // Attach activity listeners and check inactivity on mount
  useEffect(() => {
    const events = ["mousemove", "keydown", "click", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, saveLastActivity));

    // Initial inactivity check (for browser reopen)
    const lastActivity = localStorage.getItem("lastActivity");
    if (lastActivity && Date.now() - Number(lastActivity) > 10 * 60 * 1000) {
      handleLogOut();
    }

    resetTimer();

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, saveLastActivity),
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [saveLastActivity, handleLogOut, resetTimer]);

  // Axios interceptor for 401
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleLogOut();
        }
        return Promise.reject(error);
      },
    );
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [handleLogOut]);

  // Sync logout across tabs
  useEffect(() => {
    const syncLogout = (e) => {
      if (e.key === "logout-event") {
        navigate("/login");
      }
    };
    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, [navigate]);

  return { handleLogOut };
};

export default useLogoutHandler;
