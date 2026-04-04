import { useState } from "react";
import { Hr } from "../components/Common/Hr";
import { FiCheckCircle } from "react-icons/fi";
import { MdPriorityHigh } from "react-icons/md";
import { useUserContext } from "../context/userContext";
import { toast } from "react-toastify";
import { useSidebar } from "../context/SidebarContext";
import BackButton from "../components/ui/BackButton";
import { useNavigate } from "react-router-dom";
import { useSendOTP } from "../hooks/useSendOTP";
import { InputField } from "../components/Common/InputField";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";

const backendURL = import.meta.env.VITE_API_URL;

export const TransferBetweenAccount = () => {
  const navigate = useNavigate();
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions, mt5_acc_list } = useUserContext();
  // const token = localStorage.getItem("userToken");
  const [senderBalance, setSenderBalance] = useState();
  const [recieverBalance, setRecieverBalance] = useState();
  const [loading, setLoading] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem("UserInfo"));

  const [inputField, setInputField] = useState({
    senderid: "",
    receiverid: "",
    amount: "",
    note: "",
    otp: "",
    // token: token,
  });

  const [toastMessage, setToastMessage] = useState({
    otpMessage: "",
    confirmOTP: "",
  });

  const otp_type = "transfer_between_account";

  const { sendOtp } = useSendOTP(
    // token,
    toastOptions,
    setToastMessage,
    inputField?.amount,
    otp_type,
    inputField.senderid,
    inputField.receiverid,
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "senderid") {
      const selectedAcc = mt5_acc_list.find((acc) => acc.accno === value);
      if (selectedAcc) {
        setSenderBalance(selectedAcc.amount);
      }
    }
    if (name === "receiverid") {
      const selectedAcc = mt5_acc_list.find((acc) => acc.accno === value);
      if (selectedAcc) {
        setRecieverBalance(selectedAcc.amount);
      }
    }
    setInputField((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const body = {
      // token: inputField.token,
      senderid: inputField.senderid,
      receiverid: inputField.receiverid,
      amount: inputField.amount,
      otp: inputField.otp,
      note: inputField.note,
    };

    try {
      const response = await api.post(`${USER_API.MT5_TO_MT5_TRANSFER}`, body);
      if (response.data.data.status === 200) {
        setToastMessage({
          otpMessage: "",
          confirmOTP: response?.data?.data?.result,
        });

        toast.success(response.data.data.result, toastOptions);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
          <div className="flex flex-col items-center space-y-3">
            <svg
              className="animate-spin h-8 w-8 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-blue-700 font-medium">Processing...</p>
          </div>
        </div>
      )}
      <div
        onClick={() => {
          if (isMobile && toggle) {
            setToggle(false);
          }
        }}
      >
        <div className="">
          {/* Header Section */}
          <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-6xl">
            <div className="flex flex-col items-start gap-1">
              <h2 className="text-3xl font-bold text-gray-900">
                Transfer Between Account
              </h2>
              <span className="text-gray-500 font-normal text-base">
                Transfer funds between two accounts
              </span>
            </div>
            <div>
              <BackButton customPath={"/funds"} />
            </div>
          </div>
          {/* Main Row: Form and Terms */}
          <div className="flex gap-4 flex-col mt-3 mb-10 lg:flex-row">
            {/* Main Form Card */}
            <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
              <form onSubmit={handleSubmit}>
                {/* From Account */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Account
                  </label>
                  <select
                    name="senderid"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent font-medium"
                    value={inputField.senderid}
                  >
                    <option value="">Select Account</option>
                    {mt5_acc_list
                      ?.filter(
                        (value) =>
                          value.group_name !== "Demo" &&
                          value.accno !== inputField.receiverid,
                      )
                      .map((elem, index) => (
                        <option key={index}>{elem.accno}</option>
                      ))}
                  </select>
                  {inputField.senderid && (
                    <span className="text-xs">
                      Balance:{" "}
                      {mt5_acc_list.find(
                        (acc) => acc.accno === inputField.senderid,
                      )?.group_name === "Cent"
                        ? "¢"
                        : "$"}{" "}
                      {senderBalance}
                    </span>
                  )}
                </div>

                {/* To Account */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Account
                  </label>
                  <select
                    required
                    name="receiverid"
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent font-medium"
                    value={inputField.receiverid}
                  >
                    <option>Select Account</option>
                    {mt5_acc_list
                      ?.filter(
                        (item) =>
                          item.group_name !== "Demo" &&
                          item.accno !== inputField.senderid,
                      )
                      .map((elem, index) => (
                        <option key={index}>{elem.accno}</option>
                      ))}
                  </select>
                  {inputField.receiverid && (
                    <span className="text-xs">
                      Balance:{" "}
                      {mt5_acc_list.find(
                        (acc) => acc.accno === inputField.receiverid,
                      )?.group_name === "Cent"
                        ? "¢"
                        : "$"}{" "}
                      {recieverBalance}
                    </span>
                  )}
                </div>

                {/* Amount */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="flex w-full rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-blue-400">
                    <span className="flex items-center px-3 text-gray-700 bg-gray-50 border-r border-gray-300">
                      USD
                    </span>
                    <input
                      name="amount"
                      min="0"
                      step="0.01"
                      onWheel={(e) => e.target.blur()}
                      onChange={handleInputChange}
                      type="number"
                      placeholder="0.00"
                      className="flex-1 px-4 py-2 font-medium text-gray-700 bg-transparent focus:outline-none disabled:cursor-not-allowed"
                      value={inputField.amount}
                    />
                  </div>
                </div>
                {Number(inputField.amount) > Number(senderBalance) && (
                  <p className="text-red-500 text-sm mt-1">
                    You do not have the required balance for an MT5 account
                    transfer.
                  </p>
                )}
                {/* Note */}
                <div className="mb-6 mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Note
                  </label>
                  <input
                    name="note"
                    onChange={handleInputChange}
                    type="text"
                    placeholder="Enter notes for this transaction"
                    className="w-full px-4 py-2.5 border rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent font-medium"
                    value={inputField.note}
                  />
                </div>
                {/* Verification process */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">
                    Verification
                  </h2>
                  {/* Buttons */}
                  <div className="flex justify-start mb-3 mt-4">
                    <button
                      disabled={
                        !inputField.amount ||
                        !inputField?.senderid ||
                        !inputField?.receiverid ||
                        Number(inputField.amount) > Number(senderBalance)
                      }
                      onClick={sendOtp}
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
                      value={inputField.otp}
                      placeholder="Enter 6 digit OTP code"
                    />
                  </div>
                  <div>
                    <div>
                      <button
                        disabled={
                          !inputField.otp ||
                          Number(inputField.amount) > Number(senderBalance)
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
                </div>
                <Hr />
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
