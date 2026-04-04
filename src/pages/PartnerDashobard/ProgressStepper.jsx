import {
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";

const ProgressStepper = ({ userData, loading }) => {
  const levelDynamicText =
    userData?.previous_royalty_list?.map((item) => ({
      previousStatus: item?.prev_level_pay_status,
      payStatus: item?.pay_status,
      royaltyId: item?.royalty_id,
    })) || [];

  const runningLevel = Number(userData?.running_level) || 0;
  const steps = [
    "Level - 1",
    "Level - 2",
    "Level - 3",
    "Level - 4",
    "Level - 5",
  ];

  // Stepper loader
  if (loading) {
    return (
      <div className="w-full max-w-6xl px-6 mx-auto">
        <div className="flex w-full">
          {steps.map((step, index) => (
            <div
              key={index}
              className="relative flex-1 flex flex-col items-center justify-center py-3 min-w-[80px] animate-pulse"
            >
              <div
                className="w-full h-14 bg-gray-200 rounded relative"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%, 15px 50%)",
                }}
              >
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Circle colors
  const getCircleColor = (stepNumber, stepData) => {
    if (stepNumber === runningLevel) return "bg-sky-400 text-white";
    if (!stepData) return "bg-gray-200 text-gray-500";
    if (stepData.payStatus === "1") return "bg-blue-100 text-blue-600";
    if (stepData.payStatus === "0") return "bg-blue-100 text-blue-600";
    if (stepData.payStatus === "-1") return "bg-gray-300 text-gray-500";
    return "bg-gray-100 text-gray-500";
  };

  // for line colors
  const getLineColor = (stepNumber, stepData) => {
    if (stepData?.payStatus === "1" || stepNumber < runningLevel)
      return "border-blue-600";
    return "border-gray-100";
  };

  return (
    <div className="w-full max-w-6xl px-4 sm:px-6 mx-auto">
      {/* Desktop layout */}
      <div className="hidden md:flex w-full">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const stepData = levelDynamicText.find(
            (item) => Number(item.royaltyId) === stepNumber,
          );

          let bgClass = "bg-gray-200 text-gray-600";
          if (stepData) {
            if (stepData.payStatus === "1") bgClass = "bg-[#2563EB] text-white";
            else if (stepData.payStatus === "0")
              bgClass = "bg-[#93C5FD] text-white";
            else if (stepData.payStatus === "-1")
              bgClass = "bg-[#c3cfe6] text-gray-600";
          }
          if (stepNumber === runningLevel) bgClass = "bg-sky-300 text-white";

          return (
            <div
              key={index}
              className={`relative flex-1 flex flex-col items-center justify-center text-xs sm:text-sm md:text-base font-medium py-3 ${bgClass}`}
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 15px) 0, 100% 50%, calc(100% - 15px) 100%, 0 100%, 15px 50%)",
              }}
            >
              <span>{step}</span>
              {stepNumber === runningLevel && (
                <span className="text-[10px] sm:text-xs flex items-center gap-1">
                  <FaClock className="w-3 h-3" /> In Progress
                </span>
              )}
              {stepData && stepNumber !== runningLevel && (
                <span className="text-[10px] sm:text-xs flex items-center gap-1">
                  {stepData.payStatus === "1" && (
                    <>
                      <FaCheckCircle className="w-3 h-3" /> Achieved
                    </>
                  )}
                  {stepData.payStatus === "0" && (
                    <>
                      <FaHourglassHalf className="w-3 h-3" /> Pending
                    </>
                  )}
                  {stepData.payStatus === "-1" && (
                    <>
                      <FaTimesCircle className="w-3 h-3" /> Target Not Completed
                    </>
                  )}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile layout */}
      <ol className="flex md:hidden items-center w-full overflow-x-auto py-6 space-x-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const stepData = levelDynamicText.find(
            (item) => Number(item.royaltyId) === stepNumber,
          );
          const circleClasses = getCircleColor(stepNumber, stepData);
          const lineClasses =
            index < steps.length - 1 ? getLineColor(stepNumber, stepData) : "";

          return (
            <li key={index} className="flex items-center w-full">
              <span
                className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${circleClasses}`}
              >
                {stepNumber === runningLevel ? (
                  <FaClock className="w-4 h-4" />
                ) : stepData?.payStatus === "1" ? (
                  <FaCheckCircle className="w-4 h-4" />
                ) : stepData?.payStatus === "0" ? (
                  <FaHourglassHalf className="w-4 h-4" />
                ) : stepData?.payStatus === "-1" ? (
                  <FaTimesCircle className="w-4 h-4" />
                ) : (
                  stepNumber
                )}
              </span>

              {/* Line to next step */}
              {index < steps.length - 1 && (
                <span
                  className={`flex-1 h-1 border-b-4 ${lineClasses} inline-block`}
                ></span>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default ProgressStepper;
