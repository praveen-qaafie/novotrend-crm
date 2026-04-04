import { useCallback } from "react";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";

// Custom hook for data refresh functionality
export const useDataRefresh = () => {
  const {
    fetchDashboardData,
    fetchBalanceData,
    fetchUserData,
    isLoading,
    toastOptions,
  } = useUserContext();

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    try {
      await Promise.all([
        fetchDashboardData(true),
        fetchBalanceData(true),
        fetchUserData(true),
      ]);
      toast.success("Data refreshed successfully", toastOptions);
    } catch (error) {
      console.error("Error refreshing data:", error);
      toast.error("Failed to refresh data", toastOptions);
    }
  }, [fetchDashboardData, fetchBalanceData, fetchUserData, toastOptions]);

  // Refresh dashboard data only
  const refreshDashboardData = useCallback(async () => {
    try {
      await fetchDashboardData(true);
      toast.success("Dashboard data refreshed", toastOptions);
    } catch (error) {
      console.error("Error refreshing dashboard data:", error);
      toast.error("Failed to refresh dashboard data", toastOptions);
    }
  }, [fetchDashboardData, toastOptions]);

  // Refresh balance data only
  const refreshBalanceData = useCallback(async () => {
    try {
      await fetchBalanceData(true);
      toast.success("Balance data refreshed", toastOptions);
    } catch (error) {
      console.error("Error refreshing balance data:", error);
      toast.error("Failed to refresh balance data", toastOptions);
    }
  }, [fetchBalanceData, toastOptions]);

  // Refresh user data only
  const refreshUserData = useCallback(async () => {
    try {
      await fetchUserData(true);
      toast.success("User data refreshed", toastOptions);
    } catch (error) {
      console.error("Error refreshing user data:", error);
      toast.error("Failed to refresh user data", toastOptions);
    }
  }, [fetchUserData, toastOptions]);

  return {
    refreshAllData,
    refreshDashboardData,
    refreshBalanceData,
    refreshUserData,
    isLoading,
  };
};
