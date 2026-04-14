import { useState } from "react";
import { FiChevronUp, FiTrendingUp, FiSettings } from "react-icons/fi";
import { Link } from "react-router-dom";
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";

const AccountListCard = ({ accountData = [], onClickChangePassword }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  return (
    <div className="max-w-full mx-auto space-y-4 px-2 sm:px-4 md:px-0 max-w-6xl">
      {accountData.map((account, idx) => (
        <div
          key={account.id || idx}
          className="w-full bg-white border border-gray-200 rounded-lg shadow-sm max-w-6xl"
        >
          <div className="p-4 sm:p-6 pb-3 sm:pb-4">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 text-sm sm:text-md font-medium rounded ${
                      account.type !== "demo"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {account.type?.charAt(0).toUpperCase() +
                      account.type?.slice(1)}
                  </span>
                  <span className="px-2 py-1 text-sm sm:text-md font-medium border border-gray-300 text-gray-700 rounded">
                    {account.subtype || "-"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm sm:text-md text-gray-600">
                  <span>#{account.number}</span>
                  <span>{account.subtype || "-"}</span>
                </div>
              </div>
              <button
                onClick={() =>
                  setExpandedCard(expandedCard === idx ? null : idx)
                }
                className="text-gray-400 hover:text-gray-800 hover:bg-slate-300 rounded-full p-2 self-end sm:self-auto"
              >
                <FiChevronUp
                  className={`h-4 w-4 transition-transform ${
                    expandedCard === idx ? "" : "rotate-180"
                  }`}
                />
              </button>
            </div>
          </div>
          <div className="px-3 sm:px-6 pb-4 sm:pb-6 space-y-4 sm:space-y-6">
            {/* balence div */}
            <div className="flex gap-2 flex-col lg:flex-row md:items-center md:justify-between">
              <div className="flex gap-1 items-baseline justify-center">
                <span className="text-3xl font-bold text-gray-900">
                  {account.balance}
                </span>
                <span className="text-xl font-semibold text-gray-500">
                  {account.currency}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full md:w-fit justify-items-center md:justify-self-end">
                <a
                  href="https://webtrading.novotrend.co/terminal"
                  target="_blank"
                  rel="noreferrer"
                  className="w-60 sm:w-32 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <FiTrendingUp className="h-4 w-4" />
                  Trade
                </a>
                <Link
                  to="/funds/"
                  className="w-60 sm:w-32 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <FaRegArrowAltCircleDown className="h-4 w-4" />
                  Deposit
                </Link>
                <Link
                  to="/funds/withdraw"
                  className="w-60 sm:w-32 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-md flex items-center justify-center gap-2 transition-colors"
                >
                  <FaRegArrowAltCircleUp className="h-4 w-4" />
                  Withdraw
                </Link>
              </div>
            </div>

            {/* Account Details */}
            {expandedCard === idx && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3 transform ease-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Actual Leverage
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {account.actualLeverage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Free Margin
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {account.freeMargin} {account.currency}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Maximum Leverage
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {account.maxLeverage}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Equity
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {account.equity} {account.currency}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Floating P/L
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {/* Placeholder, update if you have this data */}
                      0.00 {account.currency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs sm:text-sm text-gray-600">
                      Platform
                    </span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">
                      {account.platform}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <>
              <hr className="border-gray-200" />
              {/* Server Information */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm gap-2 sm:gap-0">
                <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Nick Name</span>
                    <span className="font-medium text-gray-900">
                      {account.nickname}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Server</span>
                    <span className="font-medium text-gray-900">
                      Novotrend Ltd.
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">MT5 Login</span>
                    <span className="font-medium text-gray-900">
                      {account.accno}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    onClick={() => onClickChangePassword(account)}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors mt-2 sm:mt-0"
                  >
                    <FiSettings className="h-3 w-3" />
                    Change Trading Password
                  </button>
                  <button
                    onClick={() => onClickChangePassword(account, "nickName")}
                    className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors !mt-3 sm:mt-0"
                  >
                    <FiSettings className="h-3 w-3" />
                    Update Nick Name
                  </button>
                </div>
              </div>
            </>
          </div>
        </div>
      ))}
      {/* Click outside to close dropdowns */}
      {showDropdown !== null && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowDropdown(null)}
        />
      )}
    </div>
  );
};
export default AccountListCard;