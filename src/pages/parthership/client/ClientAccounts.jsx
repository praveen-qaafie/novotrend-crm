import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { FiLoader, FiSearch } from "react-icons/fi";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../utils/axiosInstance";
import { USER_API } from "../../../utils/constants";

export default function ClientAccounts() {
  const backendURL = import.meta.env.VITE_API_URL;
  // const token = localStorage.getItem("userToken");

  const [clientData, setClientData] = useState([]);
  const [summary, setSummary] = useState({
    total_commision: 0,
    total_lots: 0,
    clients_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mt5Query, setMt5Query] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedMt5, setDebouncedMt5] = useState("");
  const [debounceLevel, setDebounceLevel] = useState("");
  const [clientLevel, setClientLevel] = useState("");

  // ---------- DEBOUNCE HOOKS ----------
  const debounceSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearch(value);
      }, 500),
    [],
  );

  const debounceMt5 = useMemo(
    () =>
      debounce((value) => {
        setDebouncedMt5(value);
      }, 500),
    [],
  );

  const debounceClientLevel = useMemo(
    () =>
      debounce((value) => {
        setDebounceLevel(value);
      }, 500),
    [],
  );

  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  useEffect(() => {
    debounceMt5(mt5Query);
  }, [mt5Query, debounceMt5]);

  useEffect(() => {
    debounceClientLevel(clientLevel);
  }, [clientLevel, debounceClientLevel]);

  // ---------- FETCH CLIENT ACCOUNTS ----------
  const fetchClientAccounts = useCallback(
    async (search, mt5acc, searchby_level) => {
      setLoading(true);
      try {
        const response = await api.post(`${USER_API.GET_CLIENT_ACCOUNTS}`, {
          mt5acc: mt5acc || "",
          search: search || "",
          searchby_level: searchby_level || "",
          // token: token || "",
        });

        const res = response.data.data.response;
        setClientData(res.details);
        setSummary({
          total_commision: res.total_commision,
          total_lots: res.total_lots,
          clients_count: res.clients_count,
        });
      } catch (err) {
        console.error("Error fetching client accounts:", err);
        setClientData([]);
        setSummary({ total_commision: 0, total_lots: 0, clients_count: 0 });
      } finally {
        setLoading(false);
      }
    },
    [backendURL],
  );

  useEffect(() => {
    fetchClientAccounts(debouncedSearch, debouncedMt5, debounceLevel);
  }, [debouncedSearch, debouncedMt5, debounceLevel, fetchClientAccounts]);

  // ---------- EXPORT FUNCTIONS ----------
  const exportHeaders = [
    "User Name",
    "Email ID",
    "MT5 ID",
    "Sign-up date",
    "Volume (Lots)",
    "Commission",
    "Level",
  ];

  const getExportRows = () =>
    (clientData || []).map((d) => [
      d?.user_name,
      d?.email,
      d?.mt5_id,
      d?.sign_up_date,
      d?.lotsize,
      d?.commision,
      d?.level,
      d?.rebates || 0,
    ]);

  const exportCSV = () => {
    const rows = getExportRows();
    if (!rows?.length) return;

    const csvContent = [exportHeaders, ...rows]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "Report_clientsAccount.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportXLSX = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const objects = rows.map((row) =>
      Object.fromEntries(exportHeaders.map((h, i) => [h, row[i]])),
    );

    const worksheet = XLSX.utils.json_to_sheet(objects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clients Account");
    XLSX.writeFile(workbook, "Report_clientsAccount.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF();
    doc.text("Report clientsAccount", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [exportHeaders],
      body: rows,
    });

    doc.save("Report_clientsAccount.pdf");
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Client Accounts</h1>
      <div className="flex flex-wrap gap-y-6 gap-x-4 mb-8 justify-center md:justify-between">
        <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center border border-gray-200 w-full sm:w-[48%] md:w-[30%]">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {summary.clients_count || 0}
          </span>
          <span className="text-gray-600 text-sm sm:text-base text-center">
            Client Accounts
          </span>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center border border-gray-200 w-full sm:w-[48%] md:w-[30%]">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {summary.total_lots || 0}
          </span>
          <span className="text-gray-600 text-sm sm:text-base text-center">
            Volume (Lots)
          </span>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 flex flex-col items-center border border-gray-200 w-full sm:w-[48%] md:w-[30%]">
          <span className="text-xl sm:text-2xl font-bold text-gray-900">
            {summary.total_commision || 0}
          </span>
          <span className="text-gray-600 text-sm sm:text-base text-center">
            Total Commission
          </span>
        </div>
      </div>

      {/* Search Fields */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-start py-3 mb-4">
        {/* Search by User/Email */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by User or Email"
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Search by MT5 Account */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by MT5 Account"
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full"
            value={mt5Query}
            onChange={(e) => setMt5Query(e.target.value)}
          />
        </div>

        {/* Search by Level */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </div>
          <select
            className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 w-full appearance-none"
            value={clientLevel}
            onChange={(e) => setClientLevel(e.target.value)}
          >
            <option value="">Search by Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-2">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                User Name
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Email ID
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                MT5 ID
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Sign-up date
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Volume (Lots)
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Commission
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Level
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan="7" className="px-6 py-6 text-center text-gray-500">
                  <FiLoader className="animate-spin inline-block mr-2" />
                  Loading Clients Accounts...
                </td>
              </tr>
            ) : clientData?.length > 0 ? (
              clientData.map((account, index) => (
                <tr
                  key={account.user_id + account.mt5_id + index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.user_name}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.email}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.mt5_id}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.sign_up_date}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.lotsize || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.commision || "-"}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {account.level}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Export Section */}
      <div className="flex justify-start mb-2">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Export to:</span>
          <button
            onClick={exportCSV}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            CSV
          </button>
          <button
            onClick={exportXLSX}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            XLSX
          </button>
          <button
            onClick={exportPDF}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
