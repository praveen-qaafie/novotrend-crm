import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { FaUserCheck, FaChartLine, FaClock } from "react-icons/fa";
import { FaGift, FaRegCheckCircle } from "react-icons/fa";

const LevelCard = ({ target, index, onClick, isArr }) => {
  const [IsShowReward, setIsShowReward] = useState(false);

  function ShowReward(e) {
    e.stopPropagation();
    setIsShowReward(true);
    setTimeout(() => setIsShowReward(false), 5000);
  }

  const isAchieved = isArr?.[index] === "1";

  return (
    <div
      onClick={onClick}
      className="border-2 border-dashed border-blue-300 rounded-md py-5 px-7 relative h-[13rem] hover:shadow-lg transition"
    >
      <div className="mt-7">
        <div className="text-center">
          <h4 className="text-lg font-bold text-gray-600 mb-1">
            Level {target.level} - {target.name}
          </h4>
        </div>

        <div className="flex items-center justify-center mt-3">
          {IsShowReward ? (
            <h3 className="text-lg font-bold text-gray-700 mb-1 transition duration-150">
              {target.rewardPrize}
            </h3>
          ) : isAchieved ? (
            <button
              onClick={ShowReward}
              className="group flex items-center gap-2 mt-2 px-6 py-2 rounded-md text-md font-semibold text-white bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 shadow-md transition-all duration-200"
            >
              <FaRegCheckCircle className="text-white text-lg group-hover:scale-110 transition-transform" />
              <span>Achieved</span>
            </button>
          ) : (
            <button
              onClick={ShowReward}
              className="flex items-center gap-2 mt-2 px-6 py-2 rounded-md text-md font-semibold text-white bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 shadow-md transition-all duration-200"
            >
              <FaGift className="text-lg" />
              Rewards
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const PartnerLoyaltyProgram = ({ userData }) => {
  // Restructure API data
  const rewardlist = userData?.rewardlist.map((value) => ({
    name: value?.name || "",
    reward: value?.reward || "",
    time: value?.time || "",
    lotsize: value?.lotsize || "",
    level: value?.level || "",
    account: value?.tot_account || "",
  }));

  const isArr = userData?.previous_royalty_list.map((item) => item.pay_status);

  const apiData = [
    {
      level: rewardlist?.[0]?.level,
      name: rewardlist?.[0]?.name || "",
      clear: true,
      rewardPrize: rewardlist?.[0]?.reward ? `$${rewardlist[0].reward}` : "$0",
      PrizeData: {
        activeAccountRequire: { total: rewardlist?.[0]?.account || 0 },
        TradeLotRequire: {
          total: rewardlist?.[0]?.lotsize || 0,
        },
        TimeValidity: { total: parseInt(rewardlist?.[0]?.time) || 0 },
      },
    },
    {
      level: rewardlist?.[1]?.level,
      name: rewardlist?.[1]?.name || "",
      clear: false,
      rewardPrize: rewardlist?.[1]?.reward ? `$${rewardlist[1].reward}` : "$0",
      PrizeData: {
        activeAccountRequire: { total: rewardlist?.[1]?.account || 0 },
        TradeLotRequire: {
          total: rewardlist?.[1]?.lotsize || 0,
        },
        TimeValidity: { total: parseInt(rewardlist?.[1]?.time) || 0 },
      },
    },
    {
      level: rewardlist?.[2]?.level,
      name: rewardlist?.[2]?.name || "",
      clear: false,
      rewardPrize: rewardlist?.[2]?.reward ? `$${rewardlist[2].reward}` : "$0",
      PrizeData: {
        activeAccountRequire: { total: 20 },
        TradeLotRequire: {
          total: rewardlist?.[2]?.lotsize || 0,
        },
        TimeValidity: { total: parseInt(rewardlist?.[2]?.time) || 0 },
      },
    },
    {
      level: rewardlist?.[3]?.level,
      name: rewardlist?.[3]?.name || "",
      clear: false,
      rewardPrize: rewardlist?.[3]?.reward ? `$${rewardlist[3].reward}` : "$0",
      PrizeData: {
        activeAccountRequire: { total: rewardlist?.[3]?.account || 0 },
        TradeLotRequire: {
          total: rewardlist?.[3]?.lotsize || 0,
        },
        TimeValidity: { total: parseInt(rewardlist?.[3]?.time) || 0 },
      },
    },
    {
      level: rewardlist?.[4]?.level,
      name: rewardlist?.[4]?.name || "",
      clear: false,
      rewardPrize: rewardlist?.[4]?.reward ? `$${rewardlist[4].reward}` : "$0",
      PrizeData: {
        activeAccountRequire: { total: rewardlist?.[4]?.account || 0 },
        TradeLotRequire: {
          total: rewardlist?.[4]?.lotsize || 0,
        },
        TimeValidity: { total: parseInt(rewardlist?.[4]?.time) || 0 },
      },
    },
  ];

  const [showDetails, setShowDetails] = useState(true);

  const [prizeData, setPrizeData] = useState({
    activeAccountRequire: { total: 5 },
    TradeLotRequire: { total: 5 },
    TimeValidity: { total: 5 },
  });

  function changeThePrizeData(data) {
    setPrizeData(data);
  }

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm p-4">
      {/* Header */}
      <div className="text-center md:text-left">
        <h1 className="text-2xl font-bold text-gray-700">
          Loyalty Program <span className="text-blue-600"></span>
        </h1>
      </div>

      {/* Show/Hide Button */}
      <div className="flex justify-end items-start w-full">
        <button
          className="text-blue-600 text-sm flex items-center gap-1"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Hide" : "Show"}
          {showDetails ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="space-y-10">
          {apiData.map((item, index) => {
            const criteria = [
              {
                label: "Active Accounts Required",
                value: item.PrizeData.activeAccountRequire.total,
                unit: "Accounts",
                icon: <FaUserCheck className="text-blue-500" />,
              },
              {
                label: "Trade Lot Size Required",
                value: item.PrizeData.TradeLotRequire.total,
                unit: "Lots",
                icon: <FaChartLine className="text-green-500" />,
              },
              {
                label: "Time Validity",
                value: item.PrizeData.TimeValidity.total,
                unit: "Months",
                icon: <FaClock className="text-purple-500" />,
              },
            ];

            return (
              <div
                key={item.level ?? index}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-gray-300 pb-6"
              >
                {/* Left Side: Loyalty Program */}
                <div>
                  <LevelCard
                    isArr={isArr}
                    target={item}
                    index={index}
                    onClick={() => changeThePrizeData(item.PrizeData)}
                  />
                </div>

                {/* Right Side: Qualification Criteria */}
                <div className="w-full bg-white shadow-lg rounded-md border border-gray-200 overflow-hidden">
                  <div className="bg-blue-100 px-3 py-1.5 sm:px-4 sm:py-2 font-semibold text-base sm:text-lg text-gray-800">
                    Qualification Criteria - Level {item.level}
                  </div>
                  <div className="hidden sm:block">
                    {/* Desktop View */}
                    <table className="w-full text-left border-collapse">
                      <tbody>
                        {criteria.map((c, idx) => (
                          <tr
                            key={idx}
                            className={`${
                              idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                            } hover:bg-blue-50 transition`}
                          >
                            <td className="px-4 py-3 flex items-center gap-3 font-medium text-gray-700">
                              {c.icon}
                              {c.label}
                            </td>
                            <td className="px-4 py-3 text-right font-semibold text-gray-900 text-lg">
                              <span className=" px-3 py-1 rounded-lg">
                                {c.value} {c.unit}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="block sm:hidden divide-y">
                    {/* Mobile View */}
                    {criteria.map((c, idx, index) => (
                      <div
                        key={idx}
                        className="flex flex-col px-4 py-3 odd:bg-white"
                      >
                        <div className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                          {c.icon}
                          {c.label}
                        </div>
                        <div className="text-center font-semibold text-gray-900 text-base">
                          <span className=" px-3 py-1 rounded-lg">
                            {c.value} {c.unit}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PartnerLoyaltyProgram;