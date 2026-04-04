/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useSidebar } from "../context/SidebarContext";
import { MarketPlaceSection, MyAccountSection } from "./MainDashboard";
import {
  FaRegArrowAltCircleDown,
  FaRegArrowAltCircleUp,
  FaPlus,
  FaWallet,
} from "react-icons/fa";
import { PiHandWithdrawFill } from "react-icons/pi";
import { PiHandDepositFill } from "react-icons/pi";
import { FaHandHoldingDollar } from "react-icons/fa6";

export const Dashboard = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { balanceData, userInfo, fetchBalanceData } = useUserContext();

  const cardArray = [
    {
      title: "Wallet Balance",
      value: balanceData?.creditbal || 0,
      withdrawl_remaining: balanceData?.remaining_balance || 0,
      icon: <FaWallet size={40} />,
      growth: "40%",
      positive: true,
      dotLink: "/transaction-history",
      defaultTab: "Transfer",
    },
    {
      title: "Total MT5 Account Balance",
      value: balanceData?.mt5accbal || 0,
      icon: <FaHandHoldingDollar size={45} />,
      growth: "40%",
      positive: true,
      dotLink: "/transaction-history",
      defaultTab: "Transfer",
    },
    {
      title: "Total Deposits",
      value: balanceData?.debitbal || 0,
      icon: <PiHandDepositFill size={45} />,
      growth: "10%",
      positive: true,
      dotLink: "",
      defaultTab: "Transfer",
    },
    {
      title: "Total Withdrawals",
      value: balanceData?.totalwithdraw || 0,
      withdrawl_pending: balanceData?.withdraw_pending || 0,
      icon: <PiHandWithdrawFill size={45} />,
      growth: "20%",
      positive: true,
      dotLink: "/transaction-history",
      defaultTab: "Withdrawal",
    },
  ];

  useEffect(() => {
    fetchBalanceData();
  }, []);

  return (
    <>
      <div
        className={`transition-all duration-300`}
        onClick={() => {
          if (isMobile && toggle) {
            setToggle(false);
          }
        }}
      >
        {/* Header */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full max-w-6xl">
          {/* Welcome Message */}
          <div className="flex flex-col text-start">
            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 flex items-center gap-2">
              Welcome, {userInfo?.firstname + " " + userInfo?.lastname}
            </h1>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-start lg:justify-end items-stretch sm:items-center gap-3 w-full lg:w-auto mt-4 lg:mt-0">
            <Link to="/funds/deposit" className="w-full sm:w-auto">
              <button className="btn-primary">
                <FaRegArrowAltCircleDown className="w-4 h-4" />
                Deposit
              </button>
            </Link>

            <Link to="/funds/withdraw" className="w-full sm:w-auto">
              <button className="btn-primary">
                <FaRegArrowAltCircleUp className="w-4 h-4" />
                Withdrawal
              </button>
            </Link>

            <Link
              to="/account/select-account-type"
              className="w-full sm:w-auto"
            >
              <button className="btn-primary">
                <FaPlus className="w-4 h-4" />
                Open Live Account
              </button>
            </Link>
          </div>
        </header>

        {/* Balance Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 sm:grid-cols-2 gap-6 mb-10 xl:w-[1300px] max-w-6xl my-6">
          {cardArray.map((item, idx) => (
            <div
              key={idx}
              className="relative bg-white border border-[#E9EAEB] rounded-lg p-4 sm:p-6 flex flex-col items-center sm:items-start text-center sm:text-left"
            >
              {/* Icon */}
              <div className="hidden lg:flex items-center absolute right-4 top-1/2 -translate-y-1/2">
                {item.icon}
              </div>

              {/* Title */}
              <h2 className="text-base sm:text-lg font-medium text-[#181D27] mb-2 w-full">
                {item.title}
              </h2>
              {/* Balance */}
              <div className="flex flex-col sm:flex-row sm:gap-5 w-full items-center sm:items-start text-center sm:text-left">
                <div className="flex flex-col space-y-2 w-full items-center sm:items-start text-center sm:text-left">
                  <span className="text-2xl sm:text-3xl font-semibold text-[#181D27]">
                    <span className="font-medium">$</span> {item.value}
                  </span>

                  {/* Remaining Balance */}
                  {item.title === "Wallet Balance" &&
                    item.withdrawl_remaining > 0 && (
                      <span className="w-fit border-blue-600 bg-blue-50 text-black text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full border border-border-blue">
                        <span>
                          Remaining Balance: $ {item?.withdrawl_remaining || 0}
                        </span>
                      </span>
                    )}
                  {/* Withdrawal Pending */}
                  {item.title === "Total Withdrawals" &&
                    item.withdrawl_pending > 0 && (
                      <span className="w-fit border-blue-600 bg-blue-50 text-black text-xs font-medium inline-flex items-center px-2.5 py-0.5 rounded-full border border-border-blue">
                        <span>
                          Withdrawal Pending: $ {item?.withdrawl_pending || 0}
                        </span>
                      </span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* My Accounts */}
        <MyAccountSection />

        {/* Track Currency */}
        <section className="mb-16 w-full">
          <div className="flex flex-col mb-6 items-start">
            <h2 className="text-3xl font-bold text-gray-900">Track Markets</h2>
          </div>
          <div className="flex justify-start items-start">
            <MarketPlaceSection />
          </div>
        </section>
      </div>
    </>
  );
};
