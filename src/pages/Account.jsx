/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { useUserContext } from "../context/useUserContext";
import { useSidebar } from "../context/SidebarContext";
import { MyAccountSection } from "./MainDashboard";

export const Account = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { dashboardData } = useUserContext();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [accountFilter, setAccountFilter] = useState("All Accounts");

  //   date
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  // Close date picker on outside click
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

  const filteredTransactions =
    dashboardData?.mt5accounts?.filter((transaction) => {
      const matchesSearch =
        search === "" ||
        transaction.accno.includes(search) ||
        transaction.group?.toLowerCase().includes(search.toLowerCase()) ||
        transaction.balance.toString().includes(search) || // Convert balance to string before searching
        transaction.leverage?.toLowerCase().includes(search.toLowerCase()) ||
        transaction.equity.toString().includes(search);

      const matchesStatus =
        statusFilter === "All Status" || transaction.status === statusFilter;
      const matchesAccount =
        accountFilter === "All Accounts" ||
        transaction.account === accountFilter;

      return matchesSearch && matchesStatus && matchesAccount;
    }) || [];

  const formatDateRange = () => {
    if (!startDate && !endDate) return "";
    if (startDate && endDate) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return `${startDate.toLocaleDateString(
        "en-GB",
        options,
      )} – ${endDate.toLocaleDateString("en-GB", options)}`;
    }
    if (startDate) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return `${startDate.toLocaleDateString(
        "en-GB",
        options,
      )} – Select end date`;
    }
    if (endDate) {
      const options = { day: "numeric", month: "short", year: "numeric" };
      return `Select start date – ${endDate.toLocaleDateString(
        "en-GB",
        options,
      )}`;
    }
    return "";
  };

  return (
    <div
      className={`transition-all duration-300`}
      onClick={() => {
        if (isMobile && toggle) {
          setToggle(false);
        }
      }}
    >
      {/* My Accounts */}
      <MyAccountSection />
    </div>
  );
};
