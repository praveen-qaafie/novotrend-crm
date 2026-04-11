import { useState } from "react";
import useIBCommission from "../hooks/useIBCommission";
import { format } from "date-fns";

export default function IBCommission() {
  const backendURL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("userToken");

  const [amount, setAmount] = useState("");

  const { loading, error, tableData, totalCommission, withdrawCommission } =
    useIBCommission(backendURL, token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount) return;

    const success = await withdrawCommission(parseFloat(amount));
    if (success) {
      setAmount("");
    }
  };

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), "dd MMM yyyy, hh:mm a");
    } catch (e) {
      return dateStr;
    }
  };

  // Render status badge color
  const getStatusBadge = (status) => {
    let colorClass = "bg-gray-200 text-gray-700";
    if (status?.toLowerCase() === "approved")
      colorClass = "bg-green-100 text-green-700 border border-green-300";
    if (status?.toLowerCase() === "rejected")
      colorClass = "bg-red-100 text-red-700 border border-red-300";
    if (status?.toLowerCase() === "pending")
      colorClass = "bg-yellow-100 text-yellow-700 border border-yellow-300";

    return (
      <span
        className={`px-3 py-1 text-xs font-medium rounded-full ${colorClass}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-6xl space-y-8">
        {/* Withdraw Form Card */}
        <div className="bg-white shadow-md rounded-xl p-6 max-w-md mx-auto">
          <h2 className="text-xl font-bold text-gray-800 text-center mb-4">
            Withdraw Commission
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="number"
                min="0"
                step="0.01"
                onWheel={(e) => e.target.blur()}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum withdrawable:{" "}
                <span className="font-semibold">${totalCommission}</span>
              </p>
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition shadow"
            >
              {loading ? "Processing..." : "Proceed to Withdraw"}
            </button>
          </form>
        </div>

        {/* Commission Summary */}
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-600">
            Available Commission
          </h3>
          <p className="text-2xl font-bold text-green-600">
            ${totalCommission}
          </p>
        </div>

        {/* Commission History Table */}
        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          <h2 className="text-xl font-bold text-gray-800 p-4 border-b">
            IB Commission History
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 border text-center">Date</th>
                  <th className="px-4 py-3 border text-center">Amount</th>
                  <th className="px-4 py-3 border text-center">Remark</th>
                  <th className="px-4 py-3 border text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-6 text-gray-500 border"
                    >
                      Fetching data...
                    </td>
                  </tr>
                ) : tableData.length > 0 ? (
                  tableData.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-100`}
                    >
                      <td className="px-4 py-3 text-center border">
                        {formatDate(row?.date)}
                      </td>
                      <td className="px-4 py-3 text-center border">
                        $ {row?.amount}
                      </td>
                      <td className="px-4 py-3 text-center border">
                        {row?.remark}
                      </td>
                      <td className="px-4 py-3 text-center border">
                        {getStatusBadge(row?.status)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-10 text-gray-500 border"
                    >
                      <div className="flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 text-gray-300 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-6a2 2 0 012-2h6"
                          />
                        </svg>
                        No commission history found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}