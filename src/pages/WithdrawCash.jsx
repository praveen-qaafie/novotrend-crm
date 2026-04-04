import { useState } from "react";
import { InputField } from "../components/Common/InputField";
import { Hr } from "../components/Common/Hr";
import { MdPriorityHigh } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { useUserContext } from "../context/userContext";
// import axios from "axios";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import BackButton from "../components/ui/BackButton";
import { useNavigate } from "react-router-dom";
import { useSendOTP } from "../hooks/useSendOTP";
import api from "../utils/axiosInstance";
import { USER_API } from "../utils/constants";

// const backendURL = import.meta.env.VITE_API_URL;

export const WithdrawCash = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const navigate = useNavigate();
  const { toastOptions, balanceData } = useUserContext();
  // const token = localStorage.getItem("userToken");
  const userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  const otp_type = "withdraw_cash_otp";

  const [toastMessage, setToastMessage] = useState({
    otpMessage: "",
    confirmOTP: "",
  });

  const [inputFields, setInputFields] = useState({
    amount: "",
    remark: "",
    otp: "",
  });

  const { sendOtp } = useSendOTP(
    // token,
    toastOptions,
    setToastMessage,
    inputFields?.amount,
    otp_type,
  );

  const [isOtpSend, setIsOtPSend] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let body = {
        // token: token,
        amount: inputFields.amount,
        remark: inputFields.remark,
        otp: inputFields.otp,
        deposit_type: "Cash",
      };

      const registerResp = await api.post(
        `${USER_API.WITHDRAW_FUND_ADD_WALLET_BAL_CASH}`,
        body,
      );

      if (registerResp.data.data.status === 200) {
        setToastMessage({
          otpMessage: "",
          confirmOTP: registerResp?.data?.data?.result,
        });
        toast.success(registerResp.data.data.result, toastOptions);
        setInputFields({
          amount: "",
          remark: "",
          otp: "",
        });
        setIsOtPSend(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setToastMessage({
          otpMessage: "",
          confirmOTP: registerResp?.data?.data?.result,
        });
        toast.error(registerResp.data.data.result, toastOptions);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <section className={`transition-all duration-300`}>
      <div className="rounded-lg text-start md:min-h-[83vh]">
        <div
          onClick={() => {
            if (isMobile && toggle) {
              setToggle(false);
            }
          }}
        >
          {/* Header Section */}
          <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-6xl">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-3xl font-bold text-gray-900">
                Withdraw Cash
              </h2>
              <span className="text-gray-500 font-normal text-base">
                Withdraw your funds via cash
              </span>
            </div>
            <div>
              <BackButton customPath={"/funds/withdraw/"} />
            </div>
          </div>
          {/* Main Row: Form and Terms */}
          <div className="flex gap-4 flex-col mt-3 mb-10 lg:flex-row">
            {/* Form Card */}
            <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4 flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment method
                    </label>
                    <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>Cash</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-1/2 mt-4 sm:mt-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>USD</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From account
                  </label>
                  <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Wallet balance (${balanceData?.balance})</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="flex w-full rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400">
                    <span className="flex items-center px-3 text-gray-700 bg-gray-50 border-r border-gray-300">
                      USD
                    </span>
                    <input
                      required
                      min="0"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      name="amount"
                      value={inputFields.amount}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="0.00"
                      disabled={isOtpSend}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      className="flex-1 font-medium text-gray-700 p-2 bg-transparent focus:outline-none disabled:cursor-not-allowed"
                    />
                  </div>

                  {/* Error Message */}
                  {Number(inputFields.amount) >
                    Number(balanceData?.balance) && (
                    <p className="text-red-500 text-sm mt-1">
                      Withdrawable Balance cannot be more than the Wallet
                      Balance
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remark
                  </label>
                  <input
                    name="remark"
                    onChange={handleInputChange}
                    type="text"
                    value={inputFields.remark}
                    placeholder="Enter your remark"
                    className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <Hr />
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Verification
                </h2>

                {/* Buttons */}
                <div className="flex justify-start mb-3 mt-4">
                  <button
                    disabled={
                      !inputFields.amount ||
                      Number(inputFields.amount) > Number(balanceData?.balance)
                    }
                    onClick={sendOtp}
                    className="px-4 py-2 border rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 cursor-notallowed"
                  >
                    Send OTP
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {toastMessage?.otpMessage && (
                    <div className="inline-flex mb-3 items-start gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-md shadow-sm animate-fadeIn">
                      <FiCheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                      <div>
                        <p className="text-green-700 mt-0.5">
                          An OTP has been sent to your registered email:
                          <span className="font-semibold text-black ml-1">
                            {userInfo?.email}
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </p>
                {/* OTP Input */}
                <div className="mb-4">
                  <InputField
                    size="full"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    onChange={(e) => {
                      if (/^\d*$/.test(e.target.value)) {
                        handleInputChange(e);
                      }
                    }}
                    name="otp"
                    value={inputFields.otp}
                    placeholder="Enter 6 digit OTP code"
                  />
                </div>
                <div>
                  <div>
                    <button
                      disabled={
                        !inputFields.otp ||
                        Number(inputFields.amount) > Number(balanceData)
                      }
                      type="submit"
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      Confirm OTP
                    </button>
                    <br />
                    {toastMessage.confirmOTP && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-md shadow-sm mb-3 animate-fadeIn">
                        <MdPriorityHigh className="text-red-500 w-3 h-3" />
                        <span className="font-medium">
                          {toastMessage.confirmOTP}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};