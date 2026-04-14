/* eslint-disable react-hooks/exhaustive-deps */
import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaList,
  FaTh,
  FaChevronDown,
  FaInfoCircle,
  FaPlus,
} from "react-icons/fa";
import ChangePasswordModalPopup from "../../components/ui/ChangePasswordModalPopUp";
import { AccountListCard } from "../../components/Dashboard";
import AccountGridCard from "./main/AccountGridCard";
import { useUserContext } from "../../context/userContext";

const MyAccountSection = () => {
  const [activeTab, setActiveTab] = useState("Real");
  const [viewMode, setViewMode] = useState("list");
  const [filter, setFilter] = useState("newest");

  const [modalOpen, setModalOpen] = useState(false);
  const [popUpSelectedAccountData, setPopUpSelectedAccountData] = useState();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const { dashboardData, fetchDashboardData, isLoading } = useUserContext();
  const [search] = useState("");
  const [statusFilter] = useState("All Status");
  const [accountFilter] = useState("All Accounts");
  const [setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const [isNickNameType, setIsNickNameType] = useState(false);

  // Helper to transform API mt5accounts to UI structure
  const transformAccounts = (mt5accounts) => {
    if (!Array.isArray(mt5accounts)) return [];
    return mt5accounts.map((acc, idx) => ({
      id: idx + 1, // fallback id
      accno: acc.accno,
      number: acc.accno,
      nickname: acc.nickname, // or use another field if available
      platform: "MT5", // default or from API if available
      subtype: acc.group,
      server: acc.server || "-", // default or from API
      freeMargin: acc.balance,
      currency: acc.group === "Cent" ? "USC" : "USD", // default or from API
      actualLeverage: acc.leverage,
      maxLeverage: acc.leverage,
      type: acc.group === "Demo" ? "demo" : "real",
      balance: acc.balance,
      equity: acc.equity,
      group: acc.group,
      leverage: acc.leverage,
      status: acc.status || "Active", // default or from API
      account: acc.account || "-", // for filtering
    }));
  };

  // Transform dashboard data to accounts
  const accounts = transformAccounts(dashboardData?.mt5accounts || []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
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
  }, []);

  // Filter accounts based on active tab
  const filteredAccounts = accounts.filter((account) => {
    if (activeTab === "Demo") {
      return account.type === "demo";
    } else if (activeTab === "Real") {
      return account.type === "real";
    }
    return true;
  });

  // Sort accounts based on filter
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    switch (filter) {
      case "newest":
        return b.id - a.id;
      case "oldest":
        return a.id - b.id;
      case "freeMargin":
        return b.freeMargin - a.freeMargin;
      case "nickname":
        return (a.nickname || "").localeCompare(b.nickname || "");
      default:
        return 0;
    }
  });

  // Filter accounts based on search and filters
  const finalAccounts = sortedAccounts.filter((transaction) => {
    const matchesSearch =
      search === "" ||
      transaction.accno.includes(search) ||
      transaction.group?.toLowerCase().includes(search.toLowerCase()) ||
      transaction.balance.toString().includes(search) ||
      transaction.leverage?.toLowerCase().includes(search.toLowerCase()) ||
      transaction.equity.toString().includes(search);

    const matchesStatus =
      statusFilter === "All Status" || transaction.status === statusFilter;
    const matchesAccount =
      accountFilter === "All Accounts" || transaction.account === accountFilter;

    return matchesSearch && matchesStatus && matchesAccount;
  });

  // popup set function
  function openChangePasswordPopup(account, type = null) {
    setPopUpSelectedAccountData(account);
    setModalOpen(true);
    setIsNickNameType(type === "nickName");
    setOpenDropdownId(null); // Close dropdown
  }

  function closePopUp() {
    setModalOpen(false);
    setPopUpSelectedAccountData();
  }

  return (
    <>
      <section id="myaccount" className="mb-16 w-full max-w-6xl">
        <ChangePasswordModalPopup
          isOpen={modalOpen}
          accountData={popUpSelectedAccountData}
          onClose={closePopUp}
          NickName={isNickNameType ? "nickName" : ""}
        />
        {/* Header with Add Account button */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 ">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
            My Accounts
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row border-b max-w-6xl border-gray-200 mb-6 pb-5 gap-2">
          <button
            className={`flex items-center justify-center border px-[54.5px] py-2 rounded-md font-medium text-lg capitalize transition-colors
              ${activeTab === "Real" ? "btn-real" : "btn-demo"}
            `}
            onClick={() => setActiveTab("Real")}
          >
            Real
          </button>
          <button
            className={`flex items-center justify-center border px-[48px] py-2 rounded-md font-medium text-lg capitalize transition-colors
              ${
                activeTab === "Demo"
                  ? "border-blue-600 bg-blue-50 text-blue-600"
                  : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }
            `}
            onClick={() => setActiveTab("Demo")}
          >
            Demo
          </button>
          <Link to="/account/select-account-type" className="w-full sm:w-auto">
            <button className="btn-secondary">
              <FaPlus className="w-4 h-4" />
              Add Account
            </button>
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 max-w-6xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="freeMargin">Free Margin</option>
                <option value="nickname">Nickname</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaChevronDown className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
            <button
              className={`p-3 ${
                viewMode === "list"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setViewMode("list")}
              title="List View"
            >
              <FaList className="h-4 w-4" />
            </button>
            <button
              className={`p-3 ${
                viewMode === "grid"
                  ? "bg-blue-500 text-white"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
              onClick={() => setViewMode("grid")}
              title="Grid View"
            >
              <FaTh className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Accounts Grid/List View */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center h-64">
                <div className="text-lg text-gray-500">Loading Accounts...</div>
              </div>
            ) : (
              finalAccounts.map((account) => (
                <AccountGridCard
                  key={account.id}
                  account={account}
                  openDropdownId={openDropdownId}
                  setOpenDropdownId={setOpenDropdownId}
                  openChangePasswordPopup={openChangePasswordPopup}
                />
              ))
            )}
          </div>
        ) : (
          <div>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="text-lg text-gray-500">Loading Accounts...</div>
              </div>
            ) : (
              <AccountListCard
                accountData={finalAccounts}
                onClickChangePassword={openChangePasswordPopup}
              />
            )}
          </div>
        )}
        {/* Empty State */}
        {!isLoading && finalAccounts.length === 0 && (
          <div className="text-center py-5 border border-gray-200 rounded-lg max-w-6xl">
            <div className="mx-auto h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaInfoCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No Accounts Found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {activeTab === "Demo"
                ? "You don't have any demo accounts yet."
                : "You don't have any real accounts yet."}
            </p>
            <div className="mt-6">
              <Link to={"/account/select-account-type"} className="btn-demo2">
                <FaPlus className="mr-2" />
                Open {activeTab === "Demo" ? "Demo" : "Live"} Account
              </Link>
            </div>
          </div>
        )}
      </section>
    </>
  );
};

export default MyAccountSection;
