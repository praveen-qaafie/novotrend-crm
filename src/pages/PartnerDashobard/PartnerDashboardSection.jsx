import { useState, useEffect, useCallback } from "react";
import { IoTimeSharp } from "react-icons/io5";
import { FaRegCopy, FaUserCheck, FaChartLine } from "react-icons/fa";
import { AiOutlineRocket, AiOutlineStar } from "react-icons/ai";
import { toast } from "react-toastify";
import { IoIosLink } from "react-icons/io";
import { TbWallet } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useUserContext } from "../../context/useUserContext";
import { IoIosShareAlt } from "react-icons/io";
import ShareModal from "../../components/ui/SharePopup";
import PartnerLevelsPopup from "../../components/ui/PartnerLevelsPopup";
import api from "../../utils/axiosInstance";
import { PARTNER_DASHBOARD } from "../../utils/constants";

// Utility function for robust copy-to-clipboard
const copyToClipboard = async (text) => {
  if (navigator.clipboard && window.isSecureContext) {
    // navigator.clipboard API method
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      return false;
    }
  } else {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "0";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};

const PartnerDashboardSection = ({ userData }) => {
  const [partnerCodeTabView, setPartnerCodeTabView] = useState("link");
  const { toastOptions } = useUserContext();
  const [qualificationData, setQualificationData] = useState([]);

  const partnerCode = userData?.user_code || "";
  const partnerLink = `https://member.novotrend.co/register/${partnerCode}`;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPartnerLevelsOpen, setIsPartnerLevelsOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isShareModalOpen || isPartnerLevelsOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isShareModalOpen, isPartnerLevelsOpen]);

  const getIbDashboaerd = useCallback(async () => {
    await api
      .post(`${PARTNER_DASHBOARD.GET_PARTNER_DASHBOARD}`)
      .then((resp) => {
        const apiResp = resp.data.data;
        if (apiResp?.status === 200) {
          setQualificationData(apiResp?.response);
        } else {
          toast.error(apiResp?.result, toastOptions);
        }
      });
  }, [toastOptions]);

  useEffect(() => {
    getIbDashboaerd();
  }, [getIbDashboaerd]);

  const handleCopy = async (textToCopy, label) => {
    const success = await copyToClipboard(textToCopy);
    if (success) {
      toast.success(`${label} copied successfully!`, toastOptions);
    } else {
      toast.error(`Failed to copy ${label.toLowerCase()}.`, toastOptions);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side card */}
        <div className="space-y-4 col-span-1">
          {/* Total Commission Card */}
          <div className="w-full shadow-lg rounded-md border border-gray-200 overflow-hidden">
            {/* Header with blue bg */}
            <div className="flex justify-between items-center px-3 py-1.5 sm:px-4 sm:py-1.5 bg-blue-100">
              <div className="flex items-center gap-2">
                <TbWallet className="text-gray-500 w-7 h-7" />
                <span className="text-lg font-semibold text-gray-800">
                  Total Commission
                </span>
              </div>
            </div>
            {/* Progress Info */}
            <div className="divide-y">
              {/* Trading Lots */}
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex text-center justify-center gap-2 md:gap-0 md:flex-col">
                  <span className="text-3xl font-bold text-gray-900 tracking-tight">
                    {userData?.total_ib_commission || 0}
                    <span className="text-sm font-medium text-gray-500 ml-2">
                      USD Earned
                    </span>
                  </span>
                </div>
              </div>

              {/* Active Client */}
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex justify-around items-center">
                  <div className="flex items-center justify-between sm:justify-end">
                    <button
                      className="px-5 py-2 text-md text-white rounded-md shadow-md 
                       bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 transition-all duration-200 text-sm w-full sm:w-auto"
                      onClick={() => setIsPartnerLevelsOpen(true)}
                    >
                      Partner Levels
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Partner Link Card */}
          <div className="w-full shadow-lg rounded-md border border-gray-200 overflow-hidden">
            <div className="flex justify-between items-center px-3 py-1.5 sm:px-4 sm:py-1.5 bg-blue-100">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <IoIosLink className="text-gray-500 w-6 h-6" />
                <span>Your Partner Link</span>
              </div>
              <div className="flex gap-2 flex-wrap justify-center sm:justify-end">
                <button
                  onClick={() => setPartnerCodeTabView("link")}
                  className={`px-4 py-1 text-sm rounded-full border transition ${
                    partnerCodeTabView === "link"
                      ? "text-purple-700 border-purple-300"
                      : "text-gray-700 border-transparent hover:text-purple-600"
                  }`}
                >
                  Partner Link
                </button>
                <button
                  onClick={() => setPartnerCodeTabView("code")}
                  className={`px-3 py-1 text-sm rounded-full border transition ${
                    partnerCodeTabView === "code"
                      ? "text-purple-700 border-purple-300"
                      : "text-gray-700 border-transparent hover:text-purple-600"
                  }`}
                >
                  Partner Code
                </button>
              </div>
            </div>

            {/* Progress Info */}
            <div className="divide-y">
              {/* Trading Lots */}
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                {partnerCodeTabView === "code" && (
                  <div className="flex items-center justify-around bg-gray-50 border rounded-lg px-4 py-2 shadow-sm gap-3">
                    <span className="truncate font-medium text-gray-700">
                      {partnerCode}
                    </span>
                    <button
                      className="flex items-center gap-1 text-blue-600 hover:text-purple-800 transition"
                      onClick={() => handleCopy(partnerCode, "Code")}
                    >
                      <FaRegCopy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                )}
                {partnerCodeTabView === "link" && (
                  <div className="flex items-center justify-around gap-3 bg-gray-50 border rounded-lg px-4 py-2 shadow-sm">
                    <a
                      href={partnerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-blue-600 hover:underline text-sm"
                    >
                      {partnerLink}
                    </a>
                    <button
                      className="flex items-center  gap-1 text-blue-600 hover:text-purple-800 transition"
                      onClick={() => handleCopy(partnerLink, "Link")}
                    >
                      <FaRegCopy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Active Client */}
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                  <p className="text-xs sm:text-sm text-gray-500 text-center sm:text-left">
                    See all of your partner codes and links{" "}
                    <Link
                      to="/partner/report/client"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      here
                    </Link>
                  </p>
                  <button
                    onClick={() => setIsShareModalOpen(true)}
                    className="flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-600 
                  rounded-full hover:bg-blue-200 hover:text-blue-700 transition font-medium "
                  >
                    <IoIosShareAlt className="w-5 h-5" />
                    <span className="text-sm">Share</span>
                  </button>
                </div>

                {isShareModalOpen && (
                  <ShareModal
                    onClose={() => setIsShareModalOpen(false)}
                    shareLink={partnerLink}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Column */}
        <div className="space-y-4 col-span-1">
          {/* Right Side Card 1 */}
          <div className="w-full shadow-lg rounded-md border border-gray-200 overflow-hidden">
            {/* Header with blue bg */}
            <div className="flex justify-between items-center px-3 py-1.5 sm:px-4 sm:py-1.5 bg-blue-100">
              <div className="flex items-center gap-2">
                <AiOutlineRocket className="text-gray-600 w-5 h-5" />
                <span className="text-lg font-semibold text-gray-800">
                  Affiliate Progress Status
                </span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="divide-y">
              {/* Trading Lots */}
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FaChartLine className="text-green-500 w-4 h-4" />
                    <p className="text-blue-700 font-medium text-base">
                      Trading Lots
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {qualificationData?.royaltyinfo?.total_lots || 0}
                  </span>
                </div>
              </div>

              {/* Active Client */}
              <div className="px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FaUserCheck className="text-blue-500 w-4 h-4" />
                    <p className="text-blue-700 font-medium text-base">
                      Active Client
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {qualificationData?.active_clients || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Right Side Card 2 */}
          <div className="w-full shadow-lg rounded-md border border-gray-200 overflow-hidden">
            {/* Header with blue bg */}
            <div className="flex justify-between items-center px-3 py-1.5 sm:px-4 sm:py-1.5 bg-blue-100">
              <div className="flex items-center gap-2 text-lg font-semibold text-gray-700">
                <AiOutlineStar className="text-gray-500 w-6 h-6" />
                <span> Loyalty Qualification Progress</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm text-sm sm:text-base">
                <IoTimeSharp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                <span className="font-medium text-gray-800">
                  {qualificationData?.remaining_days} Days Left
                </span>
              </div>
            </div>

            {/* Progress Info */}
            <div className="divide-y">
              {/* Trading Lots */}
              <div className="px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FaChartLine className="text-green-500 w-4 h-4" />
                    <p className="text-blue-700 font-medium text-base">
                      Trading Lots
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {qualificationData?.royaltyinfo?.lotachieve || 0} /{" "}
                    {qualificationData?.royaltyinfo?.lotrequired || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        ((qualificationData?.royaltyinfo?.lotachieve || 0) /
                          (qualificationData?.royaltyinfo?.lotrequired || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Active Client */}
              <div className="px-4 py-3">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <FaUserCheck className="text-blue-500 w-4 h-4" />
                    <p className="text-blue-700 font-medium text-base">
                      Active Client
                    </p>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">
                    {qualificationData?.royaltyinfo?.levelachieve_client ?? "-"}{" "}
                    /{" "}
                    {qualificationData?.royaltyinfo?.levelrequired_client ??
                      "-"}
                  </span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-2.5 bg-blue-500 rounded-full"
                    style={{
                      width: `${
                        ((qualificationData?.royaltyinfo?.levelachieve_client ||
                          0) /
                          (qualificationData?.royaltyinfo
                            ?.levelachieve_client || 1)) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render PartnerLevelsPopup at the root, not inside any Card */}
      {isPartnerLevelsOpen && (
        <PartnerLevelsPopup onClose={() => setIsPartnerLevelsOpen(false)} />
      )}
    </div>
  );
};

export default PartnerDashboardSection;
