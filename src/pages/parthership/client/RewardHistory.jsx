import { useState, useEffect, useCallback } from "react";
import { FiLoader, FiSearch } from "react-icons/fi";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../utils/axiosInstance";
import { PARTNER_DASHBOARD } from "../../../utils/constants";

export default function ClientRewardHistory() {

  const [rewardHistory, setRewardHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // For user/email
  const [mt5Query, setMt5Query] = useState(""); // For MT5 account
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedMt5, setDebouncedMt5] = useState("");

  // ---------------- DEBOUNCE SEARCH ----------------
  useEffect(() => {
    const handler = debounce((value) => {
      setDebouncedSearch(value);
    }, 500);

    handler(searchQuery);

    return () => handler.cancel();
  }, [searchQuery]);

  useEffect(() => {
    const handler = debounce((value) => {
      setDebouncedMt5(value);
    }, 500);

    handler(mt5Query);

    return () => handler.cancel();
  }, [mt5Query]);

  // ---------------- FETCH DATA ----------------

  const fetchRewardHistoryData = useCallback(async (search, mt5acc) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${PARTNER_DASHBOARD.GET_REPORT_REWARD_HISTORY}`,
        {
          search: search || "",
          mt5acc: mt5acc || "",
        },
      );
      setRewardHistory(response.data.data.response);
    } catch (err) {
      console.error("err -------->", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRewardHistoryData(debouncedSearch, debouncedMt5);
  }, [debouncedSearch, debouncedMt5, fetchRewardHistoryData]);

  // ---------------- EXPORT FUNCTIONS ----------------
  const exportHeaders = [
    "User Name",
    "Email ID",
    "Payment Date",
    "MT5 Order",
    "Partner Code",
    "Client Country",
    "MT5 ID",
    "Client Account Type",
    "Volume (Lots)",
  ];

  const getExportRows = () =>
    (rewardHistory.details || []).map((d) => [
      d?.user_name,
      d?.email,
      d?.payment_date,
      d?.order_in_mt,
      d?.partner_code,
      d?.country_name,
      d?.mt5_id,
      d?.account_type,
      d?.tot_lot,
      d?.rebates || 0,
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
    link.setAttribute("download", "Report Reward_History.csv");
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reward_History");
    XLSX.writeFile(workbook, "Report Reward_History.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Report Reward_History", 14, 15);

    const rowHeight = 10;
    const tableHeight = rows.length * rowHeight;

    if (tableHeight > 260) {
      doc.addPage("a4", "landscape");
    }

    autoTable(doc, {
      startY: 20,
      head: [exportHeaders],
      body: rows,
      margin: { top: 20 },
      columnStyles: {
        0: { cellWidth: 27 },
        1: { cellWidth: 45 },
        2: { cellWidth: 27 },
        3: { cellWidth: 27 },
        4: { cellWidth: 27 },
        5: { cellWidth: 27 },
        6: { cellWidth: 27 },
        7: { cellWidth: 27 },
        8: { cellWidth: 27 },
      },
    });
    doc.save("Report Reward_History.pdf");
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-1">Reward History</h1>
      <p className="text-gray-600 text-sm mb-8">
        The report is updated once in 2 hours....
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {rewardHistory?.total_lots || 0}
            </span>
          </div>
          <span className="text-gray-600 text-sm mt-2">Volume (lots)</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-gray-900">
              {rewardHistory?.total_commision || 0}
            </span>
          </div>
          <span className="text-gray-600 text-sm mt-2">Commission</span>
        </div>
      </div>

      {/* Search Fields */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-start py-3 mb-4">
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
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm mb-2">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {exportHeaders.map((header, idx) => (
                <th
                  key={idx}
                  className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td
                  colSpan={exportHeaders.length}
                  className="px-6 py-6 text-center"
                >
                  <div className="flex justify-center items-center">
                    <FiLoader className="animate-spin inline-block mr-2" />
                    Loading Rewards History...
                  </div>
                </td>
              </tr>
            ) : rewardHistory.details && rewardHistory.details.length === 0 ? (
              <tr>
                <td
                  colSpan={exportHeaders.length}
                  className="px-6 py-6 text-center text-gray-500"
                >
                  No Records Found...
                </td>
              </tr>
            ) : (
              rewardHistory.details &&
              rewardHistory.details.map((history, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.user_name}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.email}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.payment_date}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.order_in_mt}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.partner_code}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.country_name}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.mt5_id}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.account_type}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {history?.tot_lot}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Export Buttons */}
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
