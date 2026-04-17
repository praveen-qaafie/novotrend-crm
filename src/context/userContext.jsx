/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import api from "../utils/axiosInstance";
import { AUTH_API, USER_API } from "../utils/constants";
import { parse, format } from "date-fns";

export const ActiveUserContext = createContext("");

const UserContextProvider = ({ children }) => {
  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  };

  const [userInfo, setUserInfo] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [mt5_acc_list, setMt5_acc_list] = useState([]);

  // Generic API handler
  const handleApi = async (apiCall, setter, errorMsg) => {
    try {
      const response = await apiCall();
      const apiResp = response?.data?.data;

      if (apiResp?.status === 200) {
        setter && setter(apiResp.response || []);
        return apiResp.response;
      } else {
        toast.error(apiResp?.result || errorMsg, toastOptions);
        return null;
      }
    } catch (error) {
      console.error(errorMsg, error);
      toast.error(errorMsg, toastOptions);
      return null;
    }
  };

  const getMt5Acc = () =>
    handleApi(
      () => api.post(`${USER_API.MT5_ACCOUNT_LIST}`),
      setMt5_acc_list,
      "Failed to load MT5 accounts",
    );

  const fetchDashboardData = () =>
    handleApi(
      () => api.post(`${USER_API.GET_DASHBOARD}`),
      setDashboardData,
      "Failed to load dashboard data",
    );

  const fetchBalanceData = () =>
    handleApi(
      () => api.post(`${USER_API.USER_BALANCE_DATA}`),
      setBalanceData,
      "Failed to load balance data",
    );

  const fetchUserData = () =>
    handleApi(
      () => api.post(`${USER_API.GET_USER_DATA}`),
      setUserInfo,
      "Failed to load user data",
    );

  // init after register (safe)
  const initUserAfterRegister = async () => {
    await Promise.allSettled([
      fetchDashboardData(),
      fetchBalanceData(),
      fetchUserData(),
    ]);
  };

  // optimized initial load
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    setIsLoading(true);

    // user-data first
    fetchUserData().finally(() => {
      // background APIs
      Promise.allSettled([
        fetchDashboardData(),
        fetchBalanceData(),
        getMt5Acc(),
      ]).finally(() => setIsLoading(false));
    });
  }, []);

  // Clear data
  const clearCache = () => {
    setDashboardData(null);
    setBalanceData(null);
    setUserInfo(null);
    setMt5_acc_list([]);
  };

  // LOGIN
  const userLogin = async ({ email, password }) => {
    try {
      setIsLoading(true);

      const response = await api.post(`${AUTH_API.LOGIN}`, {
        email,
        password,
      });

      const apiData = response?.data?.data || response?.data;

      if (apiData?.status === 200) {
        const token = apiData?.response;

        localStorage.setItem("userToken", token);
        localStorage.setItem("UserInfo", JSON.stringify(apiData));

        clearCache();

        // Critical API
        await fetchUserData();

        // Background APIs
        Promise.allSettled([
          fetchDashboardData(),
          fetchBalanceData(),
          getMt5Acc(),
        ]);

        return apiData;
      } else {
        localStorage.clear();
        clearCache();
        return apiData;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed! Please try again.", toastOptions);
      return {
        status: 500,
        result: "Something went wrong",
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot-password
  const ForgotPass = async ({ email }) => {
    try {
      const { data } = await api.post(`${AUTH_API.FORGOT_PASSWORD}`, {
        email,
      });

      if (data?.data?.status === 200) {
        toast.success(data?.data?.result, toastOptions);
      } else {
        toast.error(data?.data?.result, toastOptions);
      }
    } catch (error) {
      console.error("Forgot password error:", error);
    }
  };

  // date formate
  const formatDate = (dateString) => {
    const parsedDate = parse(dateString, "dd-MM-yyyy", new Date());
    return format(parsedDate, "yyyy-MM-dd");
  };

  // for partner-dashboard
  const becomePartner = async (accept) => {
    setIsLoading(true);
    const payload = { term_accept: accept ? 1 : 0 };

    try {
      const { data } = await api.post(`${USER_API.REGISTER_IB}`, payload);
      const apiData = data?.data;

      if (apiData?.status === 200) {
        setPartnerData(apiData);
        toast.success(apiData.result, toastOptions);
        return apiData;
      }

      if (apiData?.status === 202) {
        toast.info(apiData.result, toastOptions);
        return apiData;
      }

      if (apiData?.status === 400 && apiData?.result?.includes("Already")) {
        setPartnerData(apiData);
        toast.info(apiData.result, toastOptions);
        return apiData;
      }

      toast.error(apiData?.result, toastOptions);
    } catch (error) {
      console.error("Become partner error:", error);
      toast.error("Failed to process request", toastOptions);
      throw error;
    } finally {
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  return (
    <ActiveUserContext.Provider
      value={{
        toastOptions,
        userInfo,
        dashboardData,
        balanceData,
        isLoading,
        partnerData,
        mt5_acc_list,
        becomePartner,
        fetchDashboardData,
        fetchBalanceData,
        fetchUserData,
        clearCache,
        userLogin,
        ForgotPass,
        formatDate,
        initUserAfterRegister,
      }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
};

export default UserContextProvider;

export const useUserContext = () => {
  const context = useContext(ActiveUserContext);
  if (!context) {
    throw new Error("useUserContext must be used within ActiveUserProvider");
  }
  return context;
};