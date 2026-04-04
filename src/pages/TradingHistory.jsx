/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSidebar } from "../context/SidebarContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pagination from "../components/Common/Pagination";
import { HiArrowNarrowUp, HiArrowNarrowDown } from "react-icons/hi";
import { useUserContext } from "../context/userContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";


const TradingHistory = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { dashboardData } = useUserContext();

  const [allDealHistory, setAllDealtHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  // Filter States
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState("");
  const [orderType, setOrderType] = useState("");
  const [profitLoss, setProfitLoss] = useState("");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  // UI States
  const [isOpen, setIsOpen] = useState(false);

  // Pagination States
  const [currentPage, setCurrentPage] = useState(1);

  // Sorting States
  const [sortField, setSortField] = useState("OpenTime");
  const [sortDirection, setSortDirection] = useState("desc");

  // Refs
  const inputRef = React.useRef(null);
  const containerRef = React.useRef(null);

  // Utility Functions
  const parseDealDate = (dateStr) => {
    if (!dateStr) return null;
    const [datePart, timePart] = dateStr.split(" ");
    if (!datePart || !timePart) return null;
    const [day, month, year] = datePart.split("-").map(Number);
    const [hour, minute, second] = timePart.split(":").map(Number);
    return new Date(year, month - 1, day, hour, minute, second);
  };

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

  const mapDealNode = (node) => {
    return {
      Symbol: node.Symbol || "",
      Action: node.Action || "",
      OpenTime: node.OpenTime || node.open_date || "",
      CloseTime: node.CloseTime || node.close_date || "",
      // Lots: node.Lots || node.volume || "",
      OpenPrice: node.OpenPrice || node.open_price || "",
      ClosePrice: node.ClosePrice || node.close_price || "",
      volume: node.volume || "",
      Profit: typeof node.Profit !== "undefined" ? node.Profit : "",
      commission: typeof node.commission !== "undefined" ? node.commission : "",
      swapcharge: typeof node.swapcharge !== "undefined" ? node.swapcharge : "",
      Order: node.Order || node.PositionID || "",
      PositionID: node.PositionID || node.Order || "",
      mt5acc: node.mt5acc || node.mt5account || "",
    };
  };

  // API Functions (frontend-only pagination)
  const getDealHistory = async () => {
    setLoading(true);
    try {
      const formatDateForAPI = (date) => {
        if (!date) return "";
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };

      const today = new Date();
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(today.getDate() - 3);

      const getOrderTypeValue = () => {
        if (orderType === "open") return "1";
        if (orderType === "close") return "2";
        return "0";
      };

      const payload = {
        order_type: getOrderTypeValue(),
        mt5account: selectedAccount || "",
        profitloss: profitLoss,
        fdate: formatDateForAPI(startDate || threeDaysAgo),
        edate: formatDateForAPI(endDate || today),
      };

      const response = await api.post(
        `${USER_API.GET_ALL_ORDER_REPORT_HISTORY}`,
        payload,
      );

      const responseData = response.data.data;
      if (
        responseData &&
        responseData.status === 200 &&
        Array.isArray(responseData.response)
      ) {
        const mapped = responseData.response.map(mapDealNode);
        setAllDealtHistory(mapped);
        setTotalPage(Math.ceil(mapped.length / rowsPerPage));
      } else {
        setAllDealtHistory([]);
        setTotalPage(1);
      }
    } catch (error) {
      console.error("Error fetching deal history:", error);
      setAllDealtHistory([]);
      setTotalPage(1);
    } finally {
      setLoading(false);
    }
  };

  // Sorting Functions
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getSortedDeals = (deals) => {
    if (!sortField) return deals;

    return [...deals].sort((a, b) => {
      let aValue, bValue;

      if (sortField === "OpenTime" || sortField === "CloseTime") {
        aValue = a[sortField] ? parseDealDate(a[sortField]) : new Date(0);
        bValue = b[sortField] ? parseDealDate(b[sortField]) : new Date(0);
      } else if (sortField === "Profit") {
        aValue = Number(a.Profit) || 0;
        bValue = Number(b.Profit) || 0;
      } else {
        aValue = a[sortField] || "";
        bValue = b[sortField] || "";
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Handle Filters
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    getDealHistory();
  };

  // const handleDateChange = (dates) => {
  //   const [start, end] = dates;
  //   setStartDate(start);
  //   setEndDate(end);
  //   if (start && end) {
  //     setIsOpen(false);
  //   }
  // };

  // Fetch data on mount & filter change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getDealHistory();
  }, []);

  // Update total pages when rowsPerPage changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    setTotalPage(Math.ceil(allDealHistory.length / rowsPerPage));
    setCurrentPage(1);
  }, [rowsPerPage, allDealHistory]);

  // Pagination logic (frontend slicing)
  const sortedDeals = getSortedDeals(allDealHistory);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentDeals = sortedDeals.slice(indexOfFirstRow, indexOfLastRow);

  // Common headers
  const exportHeaders = [
    "Symbol",
    "Type",
    "Opening Time",
    "Closing Time",
    // "Lots",
    "Open Price",
    "Close Price",
    "Volume",
    "Profit",
    "Order ID",
    "MT5 ID",
    "Commission",
    "Swap Charge",
  ];

  const getExportRows = () =>
    (currentDeals || []).map((d) => [
      d.Symbol,
      d.Action,
      d.OpenTime,
      d.CloseTime,
      // d.Lots,
      d.OpenPrice,
      d.ClosePrice,
      d.volume,
      d.Profit,
      d.PositionID,
      d.mt5acc,
      d.commission,
      d.swapcharge,
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
    link.setAttribute("download", "Trading History.csv");
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Trading History");
    XLSX.writeFile(workbook, "Trading History.xlsx");
  };

  const exportPDF = () => {
    const rows = getExportRows();
    if (!rows.length) return;

    const doc = new jsPDF("landscape");

    doc.setFontSize(18);
    doc.text("Trading History", 14, 15);

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
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 22 },
        3: { cellWidth: 22 },
        4: { cellWidth: 20 },
        5: { cellWidth: 21 },
        6: { cellWidth: 21 },
        7: { cellWidth: 21 },
        8: { cellWidth: 21 },
        9: { cellWidth: 21 },
        10: { cellWidth: 21 },
        11: { cellWidth: 25 },
        12: { cellWidth: 21 },
      },
    });
    doc.save("Trading History.pdf");
  };

  // Render Helper
  const renderSortButton = (field, title) => (
    <button
      type="button"
      onClick={() => handleSort(field)}
      className="ml-1 align-middle"
      title={`Sort by ${title}`}
    >
      {sortField === field ? (
        sortDirection === "asc" ? (
          <HiArrowNarrowUp color="#2563eb" />
        ) : (
          <HiArrowNarrowDown color="#2563eb" />
        )
      ) : (
        <HiArrowNarrowUp color="#a3a3a3" />
      )}
    </button>
  );

  const renderTableRow = (txn, index) => (
    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.Symbol}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        <span
          className={`py-1 px-2 rounded-xl ${
            txn.Action === "Buy"
              ? "bg-green-300 text-green-600"
              : "bg-red-300 text-red-600"
          }`}
        >
          {txn.Action}
        </span>
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.OpenTime || "-"}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.CloseTime || "-"}
      </td>
      {/* <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.Lots}
      </td> */}
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.OpenPrice}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.ClosePrice || "-"}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.volume}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        <span
          className={`font-semibold ${
            Number(txn.Profit) > 0 ? "text-green-500" : "text-red-500"
          }`}
        >
          {txn.Profit || 0}
        </span>
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.Order || txn.PositionID}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.mt5acc}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.commission}
      </td>
      <td className="border px-3 py-3 text-center text-sm text-gray-700">
        {txn.swapcharge}
      </td>
    </tr>
  );

  return (
    <section className="transition-all duration-300">
      <div
        className="rounded-lg text-start md:min-h-[83vh]"
        onClick={() => {
          if (isMobile && toggle) setToggle(false);
        }}
      >
        <div className="flex flex-col items-start gap-1 mb-2">
          <h1 className="text-3xl font-bold text-gray-900">Trading History</h1>
        </div>

        <div className="flex gap-4 flex-col mt-3 mb-10">
          {/* Filter */}
          <div className="w-full bg-white border rounded-lg shadow-sm p-6 text-start">
            <form onSubmit={handleFilterSubmit}>
              <div className="flex flex-col md:flex-row justify-between gap-3 items-center">
                {/* Account Dropdown */}
                <select
                  className="border rounded-lg px-4 py-2 w-full md:w-1/3"
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

                {/* Order Type Dropdown */}
                <select
                  className="border rounded-lg px-4 py-2 w-full md:w-1/3"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="all orders">All Orders</option>
                  <option value="open">Open Orders</option>
                  <option value="close">Closed Orders</option>
                </select>

                {/* Profit and loss dropdown  */}
                <select
                  className="border rounded-lg px-4 py-2 w-full md:w-1/3"
                  value={profitLoss}
                  onChange={(e) => setProfitLoss(e.target.value)}
                >
                  <option value="" disabled>
                    Select Profit or Loss
                  </option>
                  <option value="profit">Profit</option>
                  <option value="loss">Loss</option>
                </select>

                {/* Date Picker */}
                <div
                  className="relative date-range-input custom-date-range-picker w-full md:w-1/3"
                  ref={containerRef}
                >
                  <input
                    ref={inputRef}
                    value={formatDateRange()}
                    onClick={() => setIsOpen(!isOpen)}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white cursor-pointer"
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
                    <div className="absolute top-full z-20 mt-1 left-0 sm:left-auto sm:right-0 w-full sm:w-auto max-w-sm">
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
                {/* Filter Button */}
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 w-full md:w-32"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Apply"}
                </button>
              </div>
            </form>
          </div>

          {/* Table */}
          <div className="w-full bg-white shadow-sm mt-4 rounded-xl">
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="min-w-full border-collapse">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Symbol
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Type
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Opening Time{" "}
                      {renderSortButton("OpenTime", "Opening Time")}
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Closing Time{" "}
                      {renderSortButton("CloseTime", "Closing Time")}
                    </th>
                    {/* <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Lots
                    </th> */}
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Open Price
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Close Price
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Volume
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Profit {renderSortButton("Profit", "Profit")}
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Order ID
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      MT5 ID
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Commission
                    </th>
                    <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
                      Swap Charge
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan="13"
                        className="p-4 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center space-y-3">
                          <svg
                            className="animate-spin h-8 w-8 text-blue-600"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v8H4z"
                            ></path>
                          </svg>
                        </div>
                      </td>
                    </tr>
                  ) : currentDeals.length === 0 ? (
                    <tr>
                      <td
                        colSpan="13"
                        className="p-4 text-center text-gray-500"
                      >
                        No Records Found...
                      </td>
                    </tr>
                  ) : (
                    currentDeals.map((txn, index) => renderTableRow(txn, index))
                  )}
                </tbody>
              </table>
            </div>
            {/* Export Section */}
            <div className="flex justify-start mt-4 ml-4">
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
            <Pagination
              currentPage={currentPage}
              totalPages={totalPage}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
              rowsPerPageOptions={[10, 20, 50, 100]}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
export default TradingHistory;
