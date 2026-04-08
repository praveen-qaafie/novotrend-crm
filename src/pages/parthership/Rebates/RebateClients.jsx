import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import RebateNav from "./RebateNav";
import { FiLoader, FiSearch } from "react-icons/fi";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PARTNER_DASHBOARD } from "../../../utils/constants";
import api from "../../../utils/axiosInstance";

export default function RebateClients() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [rebatesData, setRebatesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mt5Query, setMt5Query] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedMt5, setDebouncedMt5] = useState("");

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

  useEffect(() => {
    debounceSearch(searchQuery);
  }, [searchQuery, debounceSearch]);

  useEffect(() => {
    debounceMt5(mt5Query);
  }, [mt5Query, debounceMt5]);

  const fetchRebatesClientData = useCallback(
    async (search, mt5acc) => {
      setLoading(true);
      try {
        const response = await api.post(
          `${PARTNER_DASHBOARD.GET_REBATES_CLIENT}`,
          {
            search: search || "",
            mt5acc: mt5acc || "",
          },
        );
        setRebatesData(response.data.data.response);
      } catch (err) {
        console.error("err -------->", err);
      } finally {
        setLoading(false);
      }
    },
    [],
  ); // include dependencies

  useEffect(() => {
    fetchRebatesClientData(debouncedSearch, debouncedMt5);
  }, [debouncedSearch, debouncedMt5, fetchRebatesClientData]);

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
    "MT5 ID",
    "Rebate %",
    "Volume (Lots)",
    "Commission",
  ];

  // Convert data into rows (arrays)
  const getExportRows = () =>
    (rebatesData.details || []).map((d) => [
      d?.user_name,
      d?.email,
      d?.mt5_id,
      d?.rebate_per,
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
    link.setAttribute("download", "rebates_clients.csv");
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rebate Clients");
    XLSX.writeFile(workbook, "rebates_clients.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF();
    doc.text("Rebate Clients", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [exportHeaders],
      body: rows,
    });

    doc.save("rebates_clients.pdf");
  };

  return (
    <div className="min-h-screen">
      <RebateNav />
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
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
      </div> */}
      <div className="">
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
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer">
                  MT5 ID
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer">
                  Rebate %
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer">
                  Volume (Lots)
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600 cursor-pointer">
                  Commission
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-6 text-center">
                    <div className="flex justify-center items-center">
                      <FiLoader className="animate-spin inline-block mr-2" />
                      Loading Rebate Clients...
                    </div>
                  </td>
                </tr>
              ) : rebatesData.details && rebatesData.details.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    No Records Found...
                  </td>
                </tr>
              ) : (
                rebatesData.details &&
                rebatesData.details.map((data, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data?.user_name}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.email}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.mt5_id}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {data.rebate_per}
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
    </div>
  );
}
