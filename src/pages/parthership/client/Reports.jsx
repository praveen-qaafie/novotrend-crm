import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ClientReportTable from "../../../components/Common/ClientReportTable";
import { PARTNER_DASHBOARD } from "../../../utils/constants";
import api from "../../../utils/axiosInstance";

export default function ClientReport() {
  const backendURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("userToken");

  const [reportsClientData, setReportsClientData] = useState([]);

  const fetchClientsReportsData = useCallback(async () => {
    try {
      const response = await api.post(
        `${PARTNER_DASHBOARD.GET_REPORT_CLIENTS}`,
      );
      setReportsClientData(response.data.data.response);
    } catch (err) {
      console.error(err);
    } finally {
    }
  }, [backendURL, token]);

  useEffect(() => {
    fetchClientsReportsData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchClientsReportsData]);

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Clients</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            {reportsClientData?.clients_count || 0}
          </span>
          <span className="text-gray-600 text-sm">Clients</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            {reportsClientData?.total_lots || 0}
          </span>
          <span className="text-gray-600 text-sm">Volume (lots)</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            {reportsClientData?.total_commision || 0}
          </span>
          <span className="text-gray-600 text-sm">Commission</span>
        </div>
        {/* <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">
            {reportsClientData?.total_reward || 0}
          </span>
          <span className="text-gray-600 text-sm">Rewards</span>
        </div> */}
      </div>

      <div className="rounded-lg w-full">
        <ClientReportTable />
      </div>
    </div>
  );
}
