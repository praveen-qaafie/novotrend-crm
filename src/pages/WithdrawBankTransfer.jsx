import { useState } from "react";
import { Hr } from "../components/Common/Hr";
import { FiCheckCircle } from "react-icons/fi";
import { useUserContext } from "../context/userContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { InputField } from "../components/Common/InputField";
import { useSidebar } from "../context/SidebarContext";
import BackButton from "../components/ui/BackButton";
import { useSendOTP } from "../hooks/useSendOTP";
import useBankDetails from "../hooks/useBankDetails";
import { MdPriorityHigh } from "react-icons/md";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

export const WithdrawBankTransfer = () => {
  const navigate = useNavigate();
  const { data, loading } = useBankDetails(`${USER_API.GET_BANK_DETAILS}`, {
    method: "POST",
  });

  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions, balanceData } = useUserContext();
  const userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  const otp_type = "withdraw_bank_otp";

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
    toastOptions,
    setToastMessage,
    inputFields?.amount,
    otp_type,
  );

  const isAllValuesEmpty = data?.response
    ? Object.values(data.response).every((val) => val === "")
    : true;

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
        amount: inputFields.amount,
        remark: inputFields.remark,
        otp: inputFields.otp,
      };

      const registerResp = await api.post(
        `${USER_API.WITHDRAW_FUNDS_ADD_WALLET_BAL}`,
        body,
      );

      if (registerResp.data.data.status === 200) {
        setToastMessage({
          otpMessage: "",
          confirmOTP: registerResp?.data?.data?.result,
        });
        toast.success(registerResp.data.data.result, toastOptions);
        setInputFields({ amount: "", remark: "", otp: "" });
        setIsOtPSend(false);
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        toast.error(registerResp.data.data.result, toastOptions);
        setToastMessage({
          otpMessage: "",
          confirmOTP: registerResp?.data?.data?.result,
        });
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
                Withdraw Bank Transfer
              </h2>
              <span className="text-gray-500 font-normal text-base">
                Withdraw your funds via bank transfer
              </span>
            </div>
            <div>
              <BackButton customPath={"/funds/withdraw/"} />
            </div>
          </div>
          {/* Main Row: Form and Info/Terms */}
          <div className="flex gap-4 flex-col mt-3 mb-10 lg:flex-row">
            {/* Form Card */}
            <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              <form onSubmit={handleSubmit}>
                {/* Payment Method & Currency */}
                <div className="flex gap-4 mb-4 flex-col sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment method
                    </label>
                    <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>Bank Transfer</option>
                    </select>
                  </div>
                  <div className="w-full sm:w-1/2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Currency
                    </label>
                    <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                      <option>USD</option>
                    </select>
                  </div>
                </div>
                {/* Bank Details Card */}
                {loading ? (
                  <div className="mb-6 animate-pulse">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Bank Details
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i}>
                            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 w-36 bg-gray-300 rounded"></div>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                ) : isAllValuesEmpty ? (
                  <div className="flex flex-col items-center justify-center p-6 border rounded-2xl bg-gray-50 text-center shadow-sm">
                    <p className="text-gray-700 text-base mb-4">
                      No bank details found. Please add your bank account to
                      proceed with withdrawals.
                    </p>
                    <Link
                      to="/funds/add-bank-account"
                      className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
                    >
                      Add Bank Account
                    </Link>
                  </div>
                ) : (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold text-gray-800 mb-3">
                      Bank Details
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div>
                          <dt className="text-gray-900">Bank Name:</dt>
                          <dd className="font-medium text-gray-500">
                            {data?.response?.bankname}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-900">Account Holder:</dt>
                          <dd className="font-medium text-gray-500">
                            {data?.response?.accholder}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-900">Account No:</dt>
                          <dd className="font-medium text-gray-500">
                            {data?.response?.accno}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-900">IFSC/ Swift Code:</dt>
                          <dd className="font-medium text-gray-500">
                            {data?.response?.ifsc}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-900">IBAN Number:</dt>
                          <div className="font-medium text-gray-500">
                            {data?.response?.iban}
                          </div>
                        </div>
                      </dl>
                    </div>
                  </div>
                )}

                {/* From account */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From account
                  </label>
                  <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    <option>Wallet balance (${balanceData?.balance})</option>
                  </select>
                </div>
                {/* Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="flex flex-col w-full">
                    <div className="flex items-stretch w-full rounded-md overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400">
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
                        disabled={isOtpSend}
                        placeholder="0.00"
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key))
                            e.preventDefault();
                        }}
                        className={`flex-1 font-medium text-gray-700 p-2 bg-transparent focus:outline-none disabled:cursor-not-allowed`}
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
                </div>

                {/* Remark */}
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
                    className="w-full bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
                  />
                </div>
                <Hr />
                {/* Verification Section */}
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Verification
                </h2>
                <div className="flex justify-start mb-3 mt-4">
                  <button
                    onClick={sendOtp}
                    disabled={
                      !inputFields.amount ||
                      Number(inputFields.amount) > Number(balanceData?.balance)
                    }
                    className="px-4 py-2 border rounded-lg bg-blue-500 hover:bg-blue-600 text-white disabled:opacity-50 cursor-not-allowed"
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
                <div className="mb-4">
                  <InputField
                    required
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
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={
                      !inputFields.otp ||
                      Number(inputFields.amount) > Number(balanceData?.balance)
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 cursor-not-allowed"
                  >
                    Confirm OTP
                  </button>
                  <br />
                  <br />
                  {toastMessage.confirmOTP && (
                    <div className="mt-1 inline-flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-3 py-2 rounded-md shadow-sm mb-3 animate-fadeIn">
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
