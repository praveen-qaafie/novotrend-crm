import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RiLockPasswordLine } from "react-icons/ri";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/userContext";
import { AUTH_API, USER_API } from "../../utils/constants";
import api from "../../utils/axiosInstance";

const ChangePasswordModalPopup = ({
  isOpen,
  onClose,
  accountData,
  NickName,
}) => {

  const { toastOptions, fetchDashboardData } = useUserContext();
  const [passwordType, setPasswordType] = useState("main");
  const [mainPassword, setMainPassword] = useState("");
  const [investorPassword, setInvestorPassword] = useState("");
  const [showMainPassword, setShowMainPassword] = useState(false);
  const [showInvestorPassword, setShowInvestorPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [updateNickName, setupdateNickName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    let payload = {
      passwordtype: passwordType.toLowerCase(),
      mt5id: accountData.number,
    };

    if (passwordType.toLowerCase() === "main") {
      payload.mainpassword = mainPassword;
    } else if (passwordType.toLowerCase() === "investor") {
      payload.investorpassword = investorPassword;
    } else if (passwordType.toLowerCase() === "both") {
      payload.mainpassword = mainPassword;
      payload.investorpassword = investorPassword;
    }

    try {
      const response = await api.post(
        `${AUTH_API.CHANGE_MT5_PASSWORD}`,
        payload,
      );
      const data = response.data;

      if (data?.data?.status === 200) {
        const successMsg =
          data?.data?.result || "Password changed successfully.";
        setMessage({ type: "success", text: successMsg });
        toast.success(successMsg, toastOptions);

        //reset form fields
        setMainPassword("");
        setInvestorPassword("");
        setShowMainPassword(false);
        setShowInvestorPassword(false);

        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        const rawMsg = data?.data?.result || "Failed to change password.";
        const errorMsg = rawMsg.includes("Capital")
          ? "Password must include uppercase, lowercase, numbers, and special characters."
          : rawMsg;
        setMessage({ type: "error", text: errorMsg });
        toast.error(errorMsg, toastOptions);
      }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
      toast.error("Failed to change password. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  // handle nickname change
  const updateNickNameSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      mt5id: accountData.number,
      nickname: updateNickName,
    };

    try {
      const response = await api.post(
        `${USER_API.UPDATE_MT5_NICKNAME}`,
        payload,
      );
      const data = response.data;

      if (data?.data?.status === 200) {
        fetchDashboardData();
        toast.success(data?.data?.result || "Nickname updated", toastOptions);
        handleClose();
      } else {
        toast.error(
          data?.data?.result || "Failed to update nickname",
          toastOptions,
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && accountData?.nickname) {
      setupdateNickName(accountData.nickname);
    }
  }, [isOpen, accountData]);

  const handleClose = () => {
    setMessage({ type: "", text: "" });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      {NickName === "nickName" ? (
        <div className="bg-white rounded-xl w-[90%] max-w-md shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Update Your Nick Name</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={updateNickNameSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-start font-medium mb-1">
                MT5 ID
              </label>
              <input
                type="number"
                value={accountData.number}
                readOnly
                className="w-full px-3 py-2 border rounded "
              />
            </div>

            <div>
              <label className="block text-start font-medium mb-1">
                Nick Name
              </label>
              <input
                type="text"
                value={updateNickName}
                onChange={(e) => setupdateNickName(e.target.value)}
                className="w-full px-3 py-2 border rounded "
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-xl w-[90%] max-w-md shadow-lg p-6 relative">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Change Trading Password</h2>
            <button
              onClick={handleClose}
              className="text-gray-500 hover:text-red-500 text-xl"
            >
              &times;
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div>
              <label className="block text-start font-medium mb-1">
                MT5 ID
              </label>
              <input
                type="text"
                value={accountData.number}
                readOnly
                className="w-full px-3 py-2 border rounded "
              />
            </div>

            <div>
              <label className="block text-sm text-start font-medium mb-1">
                Password Type
              </label>
              <select
                value={passwordType}
                onChange={(e) => setPasswordType(e.target.value)}
                className="flex items-center border-2 rounded px-3 py-2 space-x-2 w-full "
              >
                <option value="Both">Both</option>
                <option value="main">Main</option>
                <option value="Investor">Investor</option>
              </select>
            </div>

            {(passwordType === "main" || passwordType === "Both") && (
              <div className="mb-4">
                <label className="block text-sm text-start font-medium mb-1">
                  Main Password
                </label>
                <div className="flex items-center border-2 rounded px-3 py-2 space-x-2 w-full">
                  <RiLockPasswordLine className="text-antique_gold w-6 h-6" />
                  <input
                    type={showMainPassword ? "text" : "password"}
                    placeholder="Enter main password"
                    className="outline-none w-full text-sm"
                    value={mainPassword}
                    onChange={(e) => setMainPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowMainPassword(!showMainPassword)}
                    className="focus:outline-none"
                  >
                    {showMainPassword ? (
                      <FaEye className="w-5 h-5 text-gray-600" />
                    ) : (
                      <FaEyeSlash className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {(passwordType === "Investor" || passwordType === "Both") && (
              <div className="mb-4">
                <label className="block text-sm text-start font-medium mb-1">
                  Investor Password
                </label>
                <div className="flex items-center border-2 rounded px-3 py-2 space-x-2 w-full mb-2">
                  <RiLockPasswordLine className="text-antique_gold w-6 h-6" />
                  <input
                    type={showInvestorPassword ? "text" : "password"}
                    placeholder="Enter investor password"
                    className="outline-none w-full text-sm"
                    value={investorPassword}
                    onChange={(e) => setInvestorPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowInvestorPassword(!showInvestorPassword)
                    }
                    className="focus:outline-none"
                  >
                    {showInvestorPassword ? (
                      <FaEye className="w-5 h-5 text-gray-600" />
                    ) : (
                      <FaEyeSlash className="w-5 h-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {message.text && (
              <div
                className={`mt-2 inline-block rounded-md px-4 py-2 text-sm shadow-md animate-fadeIn ${
                  message.type === "success"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChangePasswordModalPopup;
