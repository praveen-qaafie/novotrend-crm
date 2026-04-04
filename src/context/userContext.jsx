/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import api from "../utils/axiosInstance";
import { AUTH_API, USER_API } from "../utils/constants";

export const ActiveUserContext = createContext("");

const UserContextProvider = ({ children }) => {
  const toastOptions = {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  };

  const [userInfo, setUserInfo] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [balanceData, setBalanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [partnerData, setPartnerData] = useState(null);
  const [mt5_acc_list, setMt5_acc_list] = useState([]);

  const getMt5Acc = async () => {
    try {
      const resp = await api.post(`${USER_API.MT5_ACCOUNT_LIST}`);

      const apiResp = resp.data.data;

      if (apiResp.status === 200) {
        setMt5_acc_list(apiResp.response || []);
        return apiResp.response;
      } else {
        toast.error(
          apiResp.result || "Failed to load MT5 accounts",
          toastOptions,
        );
        setMt5_acc_list([]);
        return [];
      }
    } catch (error) {
      console.error("MT5 account fetch error:", error);
      toast.error("Could not load MT5 accounts", toastOptions);
      setMt5_acc_list([]);
      return [];
    }
  };

  // Dashboard data fetching
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`${USER_API.GET_DASHBOARD}`);
      if (response.data.data?.status === 200) {
        const data = response.data.data.response;
        setDashboardData(data);
        return data;
      } else {
        throw new Error(
          response.data.data?.result || "Failed to fetch dashboard data",
        );
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data", toastOptions);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Balance data fetching
  const fetchBalanceData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`${USER_API.USER_BALANCE_DATA}`);
      if (response.data.data?.status === 200) {
        const data = response.data.data.response;
        setBalanceData(data);
        return data;
      } else {
        throw new Error(
          response.data.data?.result || "Failed to fetch balance data",
        );
      }
    } catch (error) {
      console.error("Error fetching balance data:", error);
      toast.error("Failed to load balance data", toastOptions);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // User data fetching
  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(`${USER_API.GET_USER_DATA}`);
      if (response.data.data?.status === 200) {
        const data = response.data.data.response;
        setUserInfo(data);
        return data;
      } else {
        throw new Error(
          response.data.data?.result || "Failed to fetch user data",
        );
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data", toastOptions);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const initUserAfterRegister = async () => {
    try {
      // await Promise.all([
      //   fetchDashboardData(),
      //   fetchBalanceData(),
      //   fetchUserData(),
      // ]);
      console.log("");
    } catch (err) {
      console.error("Init user after register failed:", err);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        // await Promise.all([
        //   fetchDashboardData(),
        //   fetchBalanceData(),
        //   fetchUserData(),
        //   getMt5Acc(),
        // ]);
        console.log("");
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    if (localStorage.getItem("userToken")) {
      initializeData();
    }
  }, []);

  // Clear data when user logs out
  const clearCache = () => {
    setDashboardData(null);
    setBalanceData(null);
    setUserInfo(null);
    setMt5_acc_list([]);
  };

  // userLogin
  const userLogin = async ({ email, password }) => {
    try {
      const { data } = await api.post(`${AUTH_API.LOGIN}`, {
        email,
        password,
      });

      console.log("Full response data:", data); // ← poora response
      console.log("data.data:", data?.data); // ← nested data
      console.log("data.data.status:", data?.data?.status);

      if (data?.status === 200) {
        const { response } = data.data;

        setUserInfo(response);
        localStorage.setItem("UserInfo", JSON.stringify(response));
        localStorage.setItem("userToken", response.token);

        clearCache();

        // await Promise.all([
        //   fetchDashboardData(),
        //   fetchBalanceData(),
        //   fetchUserData(),
        //   getMt5Acc(),
        // ]);
      } else {
        localStorage.clear();
        clearCache();
      }
      return data.data;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed! Please try again.", toastOptions);
    }
  };

  // forgotPassword
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

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split("-");
    return `${year}-${month}-${day}`;
  };

  const becomePartner = async (accept) => {
    setIsLoading(true);
    const payload = {
      // token,
      term_accept: accept ? 1 : 0,
    };
    try {
      const { data } = await api.post(`${USER_API.REGISTER_IB}`, payload);
      const apiData = data?.data;
      if (apiData?.status === 200) {
        setPartnerData(apiData);
        toast.success(
          apiData.result || "Registration successful!",
          toastOptions,
        );
        return apiData;
      }

      if (apiData?.status === 202) {
        toast.info(apiData?.result, toastOptions);
        return apiData;
      }

      if (apiData?.status === 400 && apiData?.result?.includes("Already")) {
        setPartnerData(apiData);
        toast.info(apiData.result || "You are already a partner", toastOptions);
        return apiData;
      }

      toast.error(
        apiData?.result || "Unexpected response from server",
        toastOptions,
      );
    } catch (error) {
      console.error("Become partner error:", error);
      toast.error(
        error.response?.data?.data?.result || "Failed to process your request.",
        toastOptions,
      );
      throw error;
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 600);
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
