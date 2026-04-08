import { useState, useRef, useEffect, useCallback } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";
import RebateNav from "./RebateNav";
import { FiLoader, FiSearch } from "react-icons/fi";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PARTNER_DASHBOARD } from "../../../utils/constants";
import api from "../../../utils/axiosInstance";

export default function RebateHistory() {
  // const [startDate, setStartDate] = useState(null);
  // const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  // const [status, setStatus] = useState("All statuses");
  // const [clientAccount, setClientAccount] = useState("All accounts");
  // const [activeTooltip, setActiveTooltip] = useState(null);
  const containerRef = useRef(null);

  const [rebateHistory, setRebateHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For user/email
  const [mt5Query, setMt5Query] = useState(""); // For MT5 account
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedMt5, setDebouncedMt5] = useState("");

  // Debounce search fields
  // eslint-disable-next-line
  const debounceSearch = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
    [],
  );

  // eslint-disable-next-line
  const debounceMt5 = useCallback(
    debounce((value) => {
      setDebouncedMt5(value);
    }, 500),
    [],
  );

  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  useEffect(() => {
    debounceMt5(mt5Query);
  }, [mt5Query, debounceMt5]);

  const fetchRebatesHistoryData = async (search, mt5acc) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${PARTNER_DASHBOARD.GET_REBATES_HISTORY}`,
        {
          search: search || "",
          mt5acc: mt5acc || "",
        },
      );
      setRebateHistory(response.data.data.response);
    } catch (err) {
      console.error("err -------->", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRebatesHistoryData(debouncedSearch, debouncedMt5);
    // eslint-disable-next-line
  }, [debouncedSearch, debouncedMt5]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // ---------------- EXPORT FUNCTIONS ----------------
  // Common headers
  const exportHeaders = [
    "User Name",
    "Email ID",
    "Processed Date",
    "MT5 ID",
    "Volume (Lots)",
    "Commission",
  ];

  // Convert data into rows (arrays)
  const getExportRows = () =>
    (rebateHistory.details || []).map((d) => [
      d?.user_name,
      d?.email,
      d?.processed_date,
      d?.mt5_id,
      d?.tot_lot || 0,
      d?.commision || 0,
    ]);

  const exportCSV = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const csvContent = [exportHeaders, ...rows]
      .map((e) => e.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "rebates_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportXLSX = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    // Convert rows → objects dynamically using headers
    const objects = rows.map((row) =>
      Object.fromEntries(exportHeaders.map((h, i) => [h, row[i]])),
    );

    const worksheet = XLSX.utils.json_to_sheet(objects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rebate History");
    XLSX.writeFile(workbook, "rebates_history.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF();
    doc.text("Rebate History", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [exportHeaders],
      body: rows,
    });

    doc.save("rebates_history.pdf");
  };

  return (
    <div className="min-h-screen">
      <RebateNav />
      <>
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
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
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
                  Processed Date
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  MT5 ID
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Volume (Lots)
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center">
                    <div className="flex justify-center items-center">
                      <FiLoader className="animate-spin inline-block mr-2" />
                      Loading Rebate History...
                    </div>
                  </td>
                </tr>
              ) : rebateHistory.details &&
                rebateHistory.details.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No Records Found...
                  </td>
                </tr>
              ) : (
                rebateHistory.details &&
                rebateHistory.details.map((data, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.user_name}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.email}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.processed_date}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.mt5_id}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.tot_lot || 0}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.commision || 0}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Export Section */}
        <div className="flex justify-start mb-2 mt-2">
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
      </>
    </div>
  );
}