/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
// import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../components/Common/Pagination";
import { useUserContext } from "../context/userContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import All from "../components/TransactionHistoryTables/All";
import Deposit from "../components/TransactionHistoryTables/Deposit";
import TransactionTableWithdrawal from "../components/TransactionHistoryTables/Withdrawal";
import Transfer from "../components/TransactionHistoryTables/Transfer";
import { FiLoader } from "react-icons/fi";
import api from "../utils/axiosInstance";

// const backendURL = import.meta.env.VITE_API_URL;

const TABS = ["All Transaction", "Deposit", "Withdrawal", "Transfer"];

const TransactionHistory = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  // const token = localStorage.getItem("userToken");
  const [searchParams] = useSearchParams();

  const [statusFilter] = useState("all");
  const [typeFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("All Transaction");
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const { dashboardData } = useUserContext();

  // Data State
  const [allWalletHistory, setAllWalletHistory] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close date picker on outside click
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isOpen) return;
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Set tab from URL param

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(tabParam);
  }, [searchParams]);

  // Fetch wallet history on tab change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getAllWalletHistory();
  }, [activeTab, selectedAccount]);

  // --- Filtering Logic ---

  // Helper to parse 'DD-MM-YYYY HH:mm:ss' to JS Date
  const parseTransactionDate = (dateStr) => {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(" ");
    if (!datePart || !timePart) return null;
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const filteredTransactions =
    allWalletHistory?.filter((transaction) => {
      // Status filter
      const matchesStatus =
        statusFilter === "all" || transaction.status === statusFilter;

      // Search filter
      const matchesSearch =
        search === "" ||
        (transaction.Details &&
          transaction.Details.toLowerCase().includes(search.toLowerCase())) ||
        (transaction.amount &&
          transaction.amount.toLowerCase().includes(search.toLowerCase())) ||
        (transaction.Credit &&
          transaction.Credit.toString().includes(search)) ||
        (transaction.Balance &&
          transaction.Balance.toString().includes(search)) ||
        (transaction.Debit && transaction.Debit.toString().includes(search));

      // Date range filter
      let matchesDate = true;
      if (startDate || endDate) {
        const txnDate = parseTransactionDate(transaction.date);
        if (!txnDate) return false;
        if (startDate && txnDate < new Date(startDate.setHours(0, 0, 0, 0)))
          matchesDate = false;
        if (endDate && txnDate > new Date(endDate.setHours(23, 59, 59, 999)))
          matchesDate = false;
      }
      return matchesStatus && matchesSearch && matchesDate;
    }) || [];

  // --- Pagination Logic ---

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentPage(1);
  }, [
    search,
    statusFilter,
    typeFilter,
    startDate,
    endDate,
    activeTab,
    selectedAccount,
    rowsPerPage,
  ]);

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const paginatedFiltered = filteredTransactions.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage,
  );

  const totalRows =
    activeTab === "All Transaction"
      ? filteredTransactions.length
      : filteredTransactions.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));

  // --- API Endpoints ---

  const apiEndpoint = (tab) => {
    switch (tab) {
      case "All Transaction":
        return "/get_all_wallet_history.php";
      case "Deposit":
        return "/get_all_deposit_history.php";
      case "Withdrawal":
        return "/get_all_withdraw_history.php";
      case "Transfer":
        return "/get_all_transfer_history.php";
      default:
        return null;
    }
  };

  // after API test
  // --- Data Fetching ---
  const getAllWalletHistory = async () => {
    try {
      setLoading(true);
      const endpoint = apiEndpoint(activeTab);
      if (!endpoint) return;
      const userResponse = await api.post(`${endpoint}`, {
        // token,
        mt5account: selectedAccount,
      });
      if (userResponse.data.data.status === 200) {
        setAllWalletHistory(userResponse.data.data.response);
      }
    } catch (error) {
      console.error("Error fetching wallet history:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers ---
  const formatDateRange = () => {
    if (!startDate && !endDate) return "";
    const options = { day: "numeric", month: "short", year: "numeric" };
    if (startDate && endDate) {
      return `${startDate.toLocaleDateString(
        "en-GB",
        options,
      )} – ${endDate.toLocaleDateString("en-GB", options)}`;
    }
    if (startDate) {
      return `${startDate.toLocaleDateString(
        "en-GB",
        options,
      )} – Select end date`;
    }
    return "";
  };

  // Export functionality
  const getExportConfig = (activeTab, data) => {
    switch (activeTab) {
      case "All Transaction":
        return {
          headers: ["Sr No.", "Date", "Details", "Credit", "Debit", "Balance"],
          rows: data.map((t) => [
            t.Srno,
            t.date,
            t.Details,
            t.Credit,
            t.Debit,
            t.Balance,
          ]),
        };

      case "Deposit":
        return {
          headers: [
            "Date",
            "Amount",
            "Type",
            "Receipt",
            "Note",
            "Status",
            "Remark",
          ],
          rows: data.map((t) => [
            t.date,
            t.amount,
            t.payment_type,
            t.req_image ? "Yes" : "-",
            t.note,
            t.status,
            t.remark,
          ]),
        };

      case "Withdrawal":
        return {
          headers: [
            "Date",
            "Amount",
            "Type",
            "Withdraw Type",
            "Status",
            "Remark",
          ],
          rows: data.map((t) => [
            t.date,
            t.amount,
            t.withdraw_type,
            t.withdraw_type_details,
            t.status,
            t.remark,
          ]),
        };

      case "Transfer":
        return {
          headers: ["Date", "Amount", "From", "To", "Note"],
          rows: data.map((t) => [
            t.date,
            Number(t.amount || 0).toFixed(2),
            t.fromaccno,
            t.toaccno,
            t.note,
          ]),
        };
      default:
        return { headers: [], rows: [] };
    }
  };

  // CSV Export
  const exportCSV = (activeTab, data) => {
    const { headers, rows } = getExportConfig(activeTab, data);
    if (!rows.length) return;
    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${activeTab}_history.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // XLSX Export
  const exportXLSX = (activeTab, data) => {
    const { headers, rows } = getExportConfig(activeTab, data);
    if (!rows.length) return;
    const objects = rows.map((row) =>
      Object.fromEntries(headers.map((h, i) => [h, row[i]])),
    );
    const worksheet = XLSX.utils.json_to_sheet(objects);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, activeTab);
    XLSX.writeFile(workbook, `${activeTab}_history.xlsx`);
  };

  // PDF Export
  const exportPDF = (activeTab, data) => {
    const { headers, rows } = getExportConfig(activeTab, data);
    if (!rows.length) return;
    const doc = new jsPDF();
    doc.text(`${activeTab} History`, 14, 15);
    autoTable(doc, {
      startY: 20,
      head: [headers],
      body: rows,
    });
    doc.save(`${activeTab}_history.pdf`);
  };

  return (
    <section
      className="transition-all duration-300"
      onClick={() => {
        if (isMobile && toggle) setToggle(false);
      }}
    >
      <div className="rounded-lg text-start md:min-h-[83vh]">
        {/* Header */}
        <div className="flex flex-col items-start gap-1 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="text-base font-normal text-[#535862]">
            Your deposits and withdrawals will appear here.
          </p>
        </div>

        {/* Filters & Tabs */}
        <div className="flex gap-4 flex-col mt-3 mb-10">
          <div className="w-full bg-white border rounded-lg shadow-sm p-6 text-start">
            {/* Tabs */}
            <div className="w-full lg:w-fit overflow-auto border border-gray-300 rounded-lg mb-5">
              <div className="w-fit flex justify-start">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    className={`w-fit whitespace-nowrap px-4 py-2 text-sm font-semibold text-center border-r last:border-r-0 ${
                      activeTab === tab
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <form>
              <div className="flex justify-between gap-3 rounded-xl flex-wrap lg:flex-nowrap">
                {/* MT5 Account Dropdown */}
                <select
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-input-border"
                  value={selectedAccount}
                  onChange={(e) => setSelectedAccount(e.target.value)}
                >
                  <option value="">All Accounts</option>
                  {dashboardData?.mt5accounts
                    .filter((acc) => acc.group !== "Demo")
                    ?.map((acc) => (
                      <option key={acc.accno} value={acc.accno}>
                        {acc.accno}
                      </option>
                    ))}
                </select>

                {/* Search */}
                <input
                  type="text"
                  placeholder="Search"
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-input-border "
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                {/* Date Range Picker */}
                <div className="flex gap-3 w-full">
                  <div
                    className="relative date-range-input custom-date-range-picker w-full"
                    ref={containerRef}
                  >
                    <input
                      ref={inputRef}
                      value={formatDateRange()}
                      onClick={() => setIsOpen(!isOpen)}
                      readOnly
                      name="fdate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-input-border focus:border-transparent bg-white cursor-pointer"
                      placeholder="Select Date Range"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                      {(startDate || endDate) && (
                        <button
                          type="button"
                          className="text-gray-400 hover:text-red-500 focus:outline-none"
                          onClick={() => {
                            setStartDate(null);
                            setEndDate(null);
                            setIsOpen(false);
                          }}
                          tabIndex={-1}
                          aria-label="Clear date"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      )}
                      {/* Calendar Icon */}
                      <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className="focus:outline-none text-gray-400 hover:text-gray-600"
                      >
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="18"
                            rx="2"
                            ry="2"
                          />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                      </button>
                    </div>

                    {isOpen && (
                      <div className="absolute top-full z-10 mt-1 left-0 sm:left-auto sm:right-0  w-full sm:w-auto max-w-sm">
                        <div className="bg-white border border-gray-300 rounded-lg shadow-lg w-full overflow-x-auto">
                          <div className="min-w-[320px] p-3">
                            <DatePicker
                              selected={startDate}
                              onChange={(dates) => {
                                const [start, end] = dates;
                                setStartDate(start);
                                setEndDate(end);
                                if (start && end) setIsOpen(false);
                              }}
                              startDate={startDate}
                              endDate={endDate}
                              selectsRange
                              inline
                              maxDate={new Date()}
                              monthsShown={1}
                              showMonthDropdown={false}
                              showYearDropdown={false}
                              calendarClassName="!border-0 !shadow-none"
                              dayClassName={(date) => {
                                if (startDate && endDate) {
                                  if (date.getTime() === startDate.getTime())
                                    return "react-datepicker__day--range-start";
                                  if (date.getTime() === endDate.getTime())
                                    return "react-datepicker__day--range-end";
                                  if (date > startDate && date < endDate)
                                    return "react-datepicker__day--in-range";
                                }
                                return "";
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Table */}
          <div className="w-full bg-white shadow-sm mt-4 rounded-xl">
            {loading ? (
              <div className="flex justify-center py-10 text-gray-500">
                <FiLoader className="animate-spin text-xl sm:text-2xl mr-2" />
                Loading Transaction History...
              </div>
            ) : (
              <>
                {activeTab === "All Transaction" ? (
                  <All data={paginatedTransactions} />
                ) : activeTab === "Deposit" ? (
                  <Deposit data={paginatedFiltered} />
                ) : activeTab === "Withdrawal" ? (
                  <TransactionTableWithdrawal data={paginatedFiltered} />
                ) : (
                  <Transfer transferdata={paginatedFiltered} />
                )}

                {/* Export Section */}
                <div className="flex justify-start mt-4 ml-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Export to:</span>
                    <button
                      onClick={() => exportCSV(activeTab, filteredTransactions)}
                      className="text-primary-btn hover:text-primary-btn-hover font-medium"
                    >
                      CSV
                    </button>
                    <button
                      onClick={() =>
                        exportXLSX(activeTab, filteredTransactions)
                      }
                      className="text-primary-btn hover:text-primary-btn-hover font-medium"
                    >
                      XLSX
                    </button>
                    <button
                      onClick={() => exportPDF(activeTab, filteredTransactions)}
                      className="text-primary-btn hover:text-primary-btn-hover font-medium"
                    >
                      PDF
                    </button>
                  </div>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={setRowsPerPage}
                  rowsPerPageOptions={[10, 20, 50, 100]}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
export default TransactionHistory;