import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserContext } from "../context/userContext";
import { useSidebar } from "../context/SidebarContext";
import BackButton from "../components/ui/BackButton";
import {
  FaCube,
  FaCoins,
  FaChartBar,
  FaChartLine,
  FaTh,
  FaList,
} from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

// static values for account types
const accountTypeDefaults = {
  Standard: {
    min_deposit: "$500",
    min_spread: "1 Pips",
    commission: "No Commission",
  },
  Pro: {
    min_deposit: "$1,000",
    min_spread: "0.9 Pips",
    commission: "No Commission",
  },
  Business: {
    min_deposit: "$5,000",
    min_spread: "RAW",
    commission: "$5 Per Lot",
  },
  ECN: { min_deposit: "$10,000", min_spread: "RAW", commission: "$5 Per Lot" },
  Cent: { min_deposit: "300", min_spread: "1.0", commission: "0" },
  Demo: { min_deposit: "0", min_spread: "1.5", commission: "0" },
};

export const SelectAccountType = () => {
  const { toggle, isMobile, setToggle } = useSidebar();
  const { toastOptions } = useUserContext();
  const navigate = useNavigate();

  const [list_group, setList_group] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const getList_group = async () => {
      setLoading(true);
      try {
        const resp = await api.post(`${USER_API.LIST_GROUP}`);
        const apiResp = resp?.data?.data;
        if (apiResp?.status === 200) {
          setList_group(apiResp.response || []);
        } else {
          toast.error(
            apiResp?.result || "Failed to load account types",
            toastOptions,
          );
        }
      } catch (err) {
        console.error("Error fetching groups:", err);
        toast.error("Network error while fetching groups", toastOptions);
      } finally {
        setLoading(false);
      }
    };
    getList_group();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = () => {
    if (!selectedGroupId) {
      toast.error("Please select an account type", toastOptions);
      return;
    }
    navigate("/account/open-live-account", { state: { selectedGroupId } });
  };

  return (
    <section>
      <div
        onClick={() => {
          if (isMobile && toggle) setToggle(false);
        }}
      >
        <div className="lex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 w-full max-w-6xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            {/* Title */}
            <h2 className="flex justify-start flex-1 text-lg sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
              Open Account
            </h2>

            {/* View Mode Buttons */}
            <div className="flex bg-gray-100 rounded-lg overflow-hidden border border-gray-200 mr-4 sm:mr-6 md:mr-10">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-2 py-2 sm:px-3 sm:py-3 text-sm sm:text-base ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaTh className="text-sm sm:text-base" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2 py-2 sm:px-3 sm:py-3 text-sm sm:text-base ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <FaList className="text-sm sm:text-base" />
              </button>
            </div>

            {/* Back Button */}
            <div>
              <BackButton customPath={"/dashboard"} />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex justify-center py-20 text-gray-500">
              <FiLoader className="animate-spin text-xl sm:text-2xl mr-2" />
              Loading account types...
            </div>
          ) : list_group.length === 0 ? (
            <div className="text-center text-gray-600 py-10 text-sm sm:text-base">
              No account types found.
            </div>
          ) : viewMode === "list" ? (
            <div className="overflow-x-auto rounded-lg bg-white">
              <div className="min-w-[600px]">
                {/* Table header row */}
                <div className="flex items-center justify-between text-xs sm:text-sm md:text-sm lg:text-base font-semibold text-gray-800 bg-gray-200 border-b px-4 py-8 lg:px-12 rounded-t-lg">
                  <div className="flex w-1/4 justify-start">Account Type</div>
                  <div className="flex gap-4 sm:gap-6 md:gap-10 lg:gap-24 w-3/4 pl-4 sm:pl-6 md:pl-8 lg:pl-24 justify-evenly">
                    <div className="w-24 whitespace-normal text-nowrap">
                      Min Deposit
                    </div>
                    <div className="w-24 whitespace-normal text-nowrap">
                      Min Spread
                    </div>
                    <div className="w-28 whitespace-normal text-nowrap">
                      Max Leverage
                    </div>
                    <div className="w-28 whitespace-normal text-nowrap">
                      Commission
                    </div>
                  </div>
                </div>

                {/* Table rows */}
                <div className="flex flex-col mt-2">
                  {" "}
                  {/* Added mt-2 for gap from header */}
                  {list_group.map((group, idx) => {
                    const isSelected = selectedGroupId === group.groupid;
                    const icon =
                      idx % 4 === 0 ? (
                        <FaCube className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-500 shrink-0 group-hover:text-gray-700" />
                      ) : idx % 4 === 1 ? (
                        <FaCoins className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-500 shrink-0 group-hover:text-gray-700" />
                      ) : idx % 4 === 2 ? (
                        <FaChartBar className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-500 shrink-0 group-hover:text-gray-700" />
                      ) : (
                        <FaChartLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-500 shrink-0 group-hover:text-gray-700" />
                      );

                    const defaults = accountTypeDefaults[group.groupname] || {};

                    return (
                      <div key={group.groupid} className="mb-2 last:mb-0">
                        <div
                          onClick={() => setSelectedGroupId(group.groupid)}
                          className={`group flex items-center justify-between border border-gray-300 rounded-md px-4 sm:px-8 md:px-8 lg:px-12 
                          py-3 sm:py-4 md:py-4 lg:py-5 cursor-pointer transition-all duration-300 ${
                            isSelected
                              ? "bg-blue-100 text-blue-100 font-medium shadow-inner border-border-blue"
                              : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:shadow-md"
                          }`}
                        >
                          {/* Left side: radio + icon + name */}
                          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 w-1/4">
                            <input
                              type="radio"
                              name="selectgroup"
                              checked={isSelected}
                              onChange={() => setSelectedGroupId(group.groupid)}
                              className="w-3 h-3 sm:w-4 sm:h-4 text-blue-100"
                            />
                            <div>{icon}</div>
                            <span className="font-medium text-gray-900 text-xs sm:text-sm md:text-sm lg:text-base whitespace-normal md:break-words lg:whitespace-nowrap">
                              {group.groupname}
                            </span>
                          </div>

                          {/* Right side: stats */}
                          <div className="flex gap-4 sm:gap-6 md:gap-10 lg:gap-24 w-3/4 pl-4 sm:pl-6 md:pl-8 lg:pl-24 justify-evenly text-xs sm:text-sm md:text-sm lg:text-base text-gray-700">
                            <div className="w-24 whitespace-normal lg:whitespace-nowrap break-words">
                              {defaults.min_deposit ?? "-"}
                            </div>
                            <div className="w-24 whitespace-normal lg:whitespace-nowrap break-words">
                              {defaults.min_spread ?? "-"}
                            </div>
                            <div className="w-28 whitespace-normal lg:whitespace-nowrap break-words">
                              {group.leverage || "-"}
                            </div>
                            <div className="w-28 whitespace-normal lg:whitespace-nowrap break-words">
                              {defaults.commission ?? "-"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <button
                onClick={() => {
                  const container = document.getElementById("carousel");
                  container.scrollBy({ left: -280, behavior: "smooth" });
                }}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-blue-500 bg-blue-100  border-1  p-2 rounded-full shadow-lg transition-colors z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  ></path>
                </svg>
              </button>
              <div
                id="carousel"
                className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-none py-5 px-5"
              >
                {list_group.map((group, idx) => {
                  const isSelected = selectedGroupId === group.groupid;
                  const icon =
                    idx % 4 === 0 ? (
                      <FaCube
                        className={`text-6xl shrink-0 ${
                          isSelected
                            ? "text-blue-400"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                    ) : idx % 4 === 1 ? (
                      <FaCoins
                        className={`text-6xl shrink-0 ${
                          isSelected
                            ? "text-blue-400"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                    ) : idx % 4 === 2 ? (
                      <FaChartBar
                        className={`text-6xl shrink-0 ${
                          isSelected
                            ? "text-blue-400"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                    ) : (
                      <FaChartLine
                        className={`text-6xl shrink-0 ${
                          isSelected
                            ? "text-blue-400"
                            : "text-gray-500 group-hover:text-gray-700"
                        }`}
                      />
                    );

                  const defaults = accountTypeDefaults[group.groupname] || {};

                  return (
                    <div
                      key={group.groupid}
                      onClick={(e) => {
                        setSelectedGroupId(group.groupid);
                        e.currentTarget.scrollIntoView({
                          behavior: "smooth",
                          inline: "center",
                        });
                      }}
                      className={`group min-w-[280px] sm:min-w-[320px] flex-shrink-0 border rounded-xl p-6 cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl snap-center h-[400px] flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-100 border-border-blue scale-105 text-text-blue"
                          : "border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="mb-4 text-6xl">{icon}</div>
                        <span
                          className={`font-bold text-lg mb-6 ${
                            isSelected ||
                            (isSelected && "group-hover:text-text-blue")
                              ? "text-text-blue"
                              : "text-gray-500 group-hover:text-gray-700"
                          }`}
                        >
                          {group.groupname}
                        </span>
                        <div className="space-y-6 text-m w-full">
                          <div className="flex justify-between items-center border-b pb-2">
                            <span
                              className={`font-medium ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              Min deposit
                            </span>
                            <span
                              className={`font-bold ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              {defaults.min_deposit ?? "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b pb-2">
                            <span
                              className={`font-medium ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              Min spread
                            </span>
                            <span
                              className={`font-bold ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              {defaults.min_spread ?? "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center border-b pb-2">
                            <span
                              className={`font-medium ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              Max leverage
                            </span>
                            <span
                              className={`font-bold ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              {group.leverage || "-"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span
                              className={`font-medium ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              Commission
                            </span>
                            <span
                              className={`font-bold ${
                                isSelected ||
                                (isSelected && "group-hover:text-text-blue")
                                  ? "text-text-blue"
                                  : "text-gray-500 group-hover:text-gray-700"
                              }`}
                            >
                              {defaults.commission ?? "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* <div className="flex justify-center mt-6">
                        <input
                          type="radio"
                          name="selectgroup"
                          checked={isSelected}
                          onChange={() => setSelectedGroupId(group.groupid)}
                          className="w-5 h-5 accent-blue-600"
                        />
                      </div> */}
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => {
                  const container = document.getElementById("carousel");
                  container.scrollBy({ left: 280, behavior: "smooth" });
                }}
                className="absolute right-0  top-1/2 transform -translate-y-1/2 text-blue-500 bg-blue-100 border-1  p-2 rounded-full shadow-lg transition-colors z-10"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </button>
            </div>
          )}

          {/* Continue button */}
          <div className="flex justify-end mt-6 my-10">
            <button
              onClick={handleNext}
              disabled={loading}
              className="px-6 sm:px-10 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm sm:text-base shadow-md hover:shadow-lg"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
