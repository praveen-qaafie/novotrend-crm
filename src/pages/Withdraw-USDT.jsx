import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { InputField } from "../components/Common/InputField";
import { FiCheckCircle } from "react-icons/fi";
import { Hr } from "../components/Common/Hr";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import { useSendOTP } from "../hooks/useSendOTP";
import BackButton from "../components/ui/BackButton";
import { MdPriorityHigh } from "react-icons/md";
import api from "../utils/axiosInstance";
import { USER_API } from "../utils/constants";


export const WithdrawUSDT = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem("UserInfo"));
  const { toastOptions, balanceData } = useUserContext();
  const methods = useParams();
  const paymentMethod = methods.method;
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState(paymentMethod);

  const otp_type = "withdraw_crypto_otp";

  const [toastMessage, setToastMessage] = useState({
    otpMessage: "",
    confirmOTP: "",
  });

  const [inputField, setInputField] = useState({
    chain: selectedPaymentMethod,
    otp: "",
    amount: "",
    walletaddress: "",
  });

  const { sendOtp } = useSendOTP(
    toastOptions,
    setToastMessage,
    inputField?.amount,
    otp_type,
  );

  const [isOtpSend, setIsOtPSend] = useState(false);

  const handleChainChange = (e) => {
    const { value } = e.target;
    setSelectedPaymentMethod(value);
    setInputField((prev) => ({
      ...prev,
      chain: value,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputField((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setSelectedPaymentMethod(paymentMethod);
  }, [paymentMethod]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      chain: inputField.chain,
      otp: inputField.otp,
      amount: inputField.amount,
      walletaddress: inputField.walletaddress,
    };

    try {
      const response = await api.post(
        `${USER_API.WITHDRAW_FUND_BY_CRYPTO}`,
        formData,
      );
      if (response.data.data.status === 200) {
        setToastMessage({
          otpMessage: "",
          confirmOTP: response?.data?.data?.result,
        });

        toast.success(response.data.data.result, toastOptions);
        setIsOtPSend(false);
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setToastMessage({
          otpMessage: "",
          confirmOTP: response?.data?.data?.result,
        });

        toast.error(response.data.data.result, toastOptions);
      }
    } catch (err) {
      console.error("err -------->", err);
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
                Withdraw USDT
              </h2>
              <span className="text-gray-500 font-normal text-base">
                Withdraw your funds via USDT (Crypto Wallet)
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
              {/* Payment Method and Currency */}
              <form onSubmit={handleSubmit}>
                <div className="flex gap-4 mb-4 flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment method
                    </label>
                    <select
                      name="paymentMethod"
                      value={selectedPaymentMethod}
                      onChange={handleChainChange}
                      className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option>bsc</option>
                      <option>tron</option>
                      <option>eth</option>
                      <option>polygon</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-1/2 sm:mt-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>USD</option>
                    </select>
                  </div>
                </div>

                {/* To Account */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To account
                  </label>
                  <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Wallet (${balanceData?.balance})</option>
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
                      onChange={handleInputChange}
                      type="number"
                      placeholder="0.00"
                      disabled={isOtpSend}
                      className="flex-1 font-medium text-gray-700 p-2 bg-transparent focus:outline-none disabled:cursor-not-allowed"
                    />
                  </div>
                  {/* Error Message */}
                  {Number(inputField.amount) > Number(balanceData?.balance) && (
                    <p className="text-red-500 text-sm mt-1">
                      Withdrawable Balance cannot be more than the Wallet
                      Balance
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Wallet Address
                  </label>
                  <input
                    name="walletaddress"
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Address"
                    className="w-full border rounded-md text-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent font-medium"
                  />
                </div>
                <Hr />
                {/* Header */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Verification
                </h2>
                {/* Buttons */}
                <div className="flex justify-start mb-3 mt-4">
                  <button
                    onClick={sendOtp}
                    disabled={
                      !inputField.amount ||
                      Number(inputField.amount) > Number(balanceData?.balance)
                    }
                    className="px-4 py-2 border rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                </div>
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
                    placeholder="Enter 6 digit OTP code"
                  />
                </div>
                <div>
                  <button
                    disabled={
                      !inputField.otp ||
                      Number(inputField.amount) > Number(balanceData?.balance)
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
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
