import { useState, useEffect, useMemo, useCallback } from "react";
import { FiSearch, FiLoader } from "react-icons/fi";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../utils/axiosInstance";
import { PARTNER_DASHBOARD } from "../../utils/constants";

const ClientReportTable = () => {
  const backendURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("userToken");

  const [reportsClientData, setReportsClientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  // ---------------- EXPORT FUNCTIONS ----------------
  const exportHeaders = [
    "User Name",
    "Email ID",
    "Status",
    "Rewards",
    "Rebates",
  ];

  const getExportRows = () =>
    (filteredData || []).map((d) => [
      d?.user_name,
      d?.email,
      d?.status,
      d?.reward,
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
    link.setAttribute("download", "clients_reports.csv");
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rebate Clients");
    XLSX.writeFile(workbook, "report_clients.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF();
    doc.text("Report Clients", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [exportHeaders],
      body: rows,
    });

    doc.save("report_clients.pdf");
  };

  // ---------------- FETCH DATA ----------------
  const fetchClientsReportsData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.post(
        `${PARTNER_DASHBOARD.GET_REPORT_CLIENTS}`,
      );
      setReportsClientData(response.data.data.response);
    } catch (err) {
      console.error("Error fetching clients reports:", err);
    } finally {
      setLoading(false);
    }
  }, [backendURL, token]);

  // ---------------- DEBOUNCE SEARCH ----------------
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setDebouncedSearchQuery(value);
      }, 500),
    [],
  );

  useEffect(() => {
    fetchClientsReportsData();
  }, [fetchClientsReportsData]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  // ---------------- FILTER DATA ----------------
  const filteredData = useMemo(() => {
    let filtered = reportsClientData.details || [];

    if (debouncedSearchQuery) {
      filtered = filtered.filter(
        (row) =>
          row.user_name
            .toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          row.email.toLowerCase().includes(debouncedSearchQuery.toLowerCase()),
      );
    }

    if (statusFilter && statusFilter !== "All") {
      filtered = filtered.filter((row) => row?.status === statusFilter);
    }

    return filtered;
  }, [debouncedSearchQuery, statusFilter, reportsClientData]);

  return (
    <>
      <div className="p-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-start py-3">
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

          <div className="flex w-full sm:w-[220px] gap-2">
            <select
              className="w-full border border-gray-300 rounded px-3 py-2 text-gray-700"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="" disabled>
                Status
              </option>
              <option value="All">All</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
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
                  Status
                </th>
                <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                  Rebates
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-6 text-center text-gray-500"
                  >
                    <FiLoader className="animate-spin inline-block mr-2" />
                    Loading Clients...
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.id}>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {row?.user_name}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {row.email}
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          row?.status === "Inactive"
                            ? "bg-red-500 text-white"
                            : "bg-green-500 text-white"
                        }`}
                      >
                        {row?.status}
                      </span>
                    </td>
                    <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                      {row?.rebates} USD
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700"
                  >
                    No Records Found...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Export Section */}
        <div className="flex justify-start mt-2">
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
    </>
  );
};

export default ClientReportTable;
