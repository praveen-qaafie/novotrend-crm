/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { apiRequest } from "../utils/api";
import { USER_API } from "../utils/constants";

export default function useIBCommission(backendURL, token) {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totalCommission, setTotalCommission] = useState(0);
  const [error, setError] = useState("");

  // Fetch IB commission history (table)
  const fetchHistory = async () => {
    setLoading(true);
    const { data, error } = await apiRequest(
      `${USER_API.GET_IB_ALL_COMMISSION}`,
    );
    if (data) {
      setTableData(data?.data?.response);
    } else {
      setTableData([]);
    }
    if (error) setError(error);
    setLoading(false);
  };

  // Fetch total commission
  const fetchTotalCommission = async () => {
    const { data, error } = await apiRequest(`${USER_API.GET_IB_COMMISSION}`);
    if (data) {
      setTotalCommission(parseFloat(data?.data?.response?.total_ib_commission));
    }
    if (error) setError(error);
  };

  // Withdraw
  const withdrawCommission = async (amount) => {
    if (amount > totalCommission) {
      setError(`You can withdraw only up to ${totalCommission} USD.`);
      return false;
    }
    setError("");
    setLoading(true);
    const { error } = await apiRequest(
      `${USER_API.WITHDRAWS_IB_FUNDS_ADD_WALLET}`,
      { token, amount },
    );
    setLoading(false);

    if (error) {
      setError(error);
      return false;
    }
    // Refresh after withdraw
    await fetchHistory();
    await fetchTotalCommission();
    return true;
  };

  // Load initial data
  useEffect(() => {
    if (token) {
      fetchHistory();
      fetchTotalCommission();
    }
  }, [token]);

  return {
    loading,
    error,
    tableData,
    totalCommission,
    withdrawCommission,
  };
}
