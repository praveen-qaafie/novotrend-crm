import { useState, useRef, useEffect, useCallback } from "react";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateRangePicker.css";
// import axios from "axios";
import { FiLoader, FiSearch } from "react-icons/fi";
import debounce from "lodash.debounce";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../../../utils/axiosInstance";
import { USER_API } from "../../../utils/constants";

export default function ClientTransaction() {
  // const [startDate, setStartDate] = useState(new Date(2025, 5, 13));
  // const [endDate, setEndDate] = useState(new Date(2025, 5, 18));
  const [isOpen, setIsOpen] = useState(false);
  // const inputRef = useRef(null);
  const containerRef = useRef(null);

  // const backendURL = import.meta.env.VITE_API_URL;
  // const token = localStorage.getItem("userToken");

  const [clientTransactionData, setClientTransactionData] = useState([]);
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

  const fetchClientTransactionData = async (search, mt5acc) => {
    setLoading(true);
    try {
      const response = await api.post(
        `${USER_API.GET_REPORT_CLIENT_TRANSACTION}`,
        {
          // token: token,
          search: search || "",
          mt5acc: mt5acc || "",
        },
      );
      setClientTransactionData(response.data.data.response);
    } catch (err) {
      console.error("err -------->", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientTransactionData(debouncedSearch, debouncedMt5);
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

  // const formatDateRange = () => {
  //   if (!startDate && !endDate) return "";
  //   if (startDate && endDate) {
  //     const options = { day: "numeric", month: "short", year: "numeric" };
  //     return `${startDate.toLocaleDateString(
  //       "en-GB",
  //       options
  //     )} – ${endDate.toLocaleDateString("en-GB", options)}`;
  //   }
  //   if (startDate) {
  //     const options = { day: "numeric", month: "short", year: "numeric" };
  //     return `${startDate.toLocaleDateString(
  //       "en-GB",
  //       options
  //     )} – Select end date`;
  //   }
  //   return "";
  // };

  // ---------------- EXPORT FUNCTIONS ----------------

  const exportHeaders = [
    "User Name",
    "MT5 ID",
    "Date",
    "Volume (Lots)",
    "Commission",
  ];

  const getExportRows = () =>
    (clientTransactionData.details || []).map((d) => [
      d?.user_name,
      d?.mt5_id,
      d?.date,
      d?.tot_lot,
      d?.commision,
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
    link.setAttribute("download", "Report_ClientTransactions.csv");
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "ClientTransactions");
    XLSX.writeFile(workbook, "Report_ClientTransactions.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF();
    doc.text("Report ClientTransactions", 14, 15);

    autoTable(doc, {
      startY: 20,
      head: [exportHeaders],
      body: rows,
    });

    doc.save("Report_ClientTransactions.pdf");
  };

  return (
    <div className="min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Client Transactions
      </h1>

      {/* Filter Section */}
      {/* <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
        <div className="grid grid-cols-3 gap-6 items-end max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Client account</label>
            <select className="w-full h-11 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
              <option>All</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Date</label>
            <div className="relative date-range-input custom-date-range-picker" ref={containerRef}>
              <input
                ref={inputRef}
                value={formatDateRange()}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
                placeholder="13 Jun, 2025 – 18 Jun, 2025"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              {isOpen && (
                <div className="absolute top-full left-0 z-50 mt-1">
                  <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                 
                    <div className="select-button mb-4">
                      <span>Select</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M6 9l6 6l6-6"/>
                      </svg>
                    </div>
                    
                 
                    <DatePicker
                      selected={startDate}
                      onChange={(dates) => {
                        const [start, end] = dates;
                        setStartDate(start);
                        setEndDate(end);
                        if (start && end) {
                          setIsOpen(false);
                        }
                      }}
                      startDate={startDate}
                      endDate={endDate}
                      selectsRange
                      inline
                      monthsShown={1}
                      showMonthDropdown={false}
                      showYearDropdown={false}
                      calendarClassName="!border-0 !shadow-none"
                      dayClassName={(date) => {
                        if (startDate && endDate) {
                          if (date.getTime() === startDate.getTime()) return "react-datepicker__day--range-start";
                          if (date.getTime() === endDate.getTime()) return "react-datepicker__day--range-end";
                          if (date > startDate && date < endDate) return "react-datepicker__day--in-range";
                        }
                        return "";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center text-gray-600 hover:text-gray-800 gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72Z" clipRule="evenodd" />
              </svg>
              Clear filters
            </button>
            <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div> */}

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-black-500">
              {clientTransactionData?.total_commision || 0}
            </span>
          </div>
          <span className="text-gray-600 text-sm mt-2">Commission</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <div className="flex items-baseline">
            <span className="text-2xl font-bold text-black-500">
              {clientTransactionData?.total_lots || 0}
            </span>
          </div>
          <span className="text-gray-600 text-sm mt-2">Volume (Lots)</span>
        </div>
        <div className="bg-white rounded-lg p-6 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-black-500">
            {clientTransactionData?.total_transaction || 0}
          </span>
          <span className="text-gray-600 text-sm mt-2">Transactions</span>
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
                MT5 ID
                {/* <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 5l0 14" />
                    <path d="M16 15l-4 4" />
                    <path d="M8 15l4 4" />
                  </svg> */}
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Date
              </th>
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                Volume (Lots)
              </th>
              {/* <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                <div className="flex items-center">
                  Spread
                </div>
              </th> */}
              <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                <div className="flex flex-col">Commission</div>
              </th>
              {/* <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                <div className="flex items-center">
                  Commission
                </div>
              </th> */}
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center">
                  <div className="flex justify-center items-center">
                    <FiLoader className="animate-spin inline-block mr-2" />
                    Loading Transactions...
                  </div>
                </td>
              </tr>
            ) : clientTransactionData.details &&
              clientTransactionData.details.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                  No Records Found...
                </td>
              </tr>
            ) : (
              clientTransactionData.details &&
              clientTransactionData.details.map((data, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {data?.user_name}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {data?.mt5_id}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {data?.date}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {data?.tot_lot || 0}
                  </td>
                  <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                    {data?.Commission || 0}
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
  );
}
