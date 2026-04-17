import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useSidebar } from "../context/SidebarContext";
import { toast } from "react-toastify";
import BackButton from "../components/ui/BackButton";
import { Hr } from "../components/Common/Hr";
// import HundredBonusTerms from "./Terms&condition/HundredBonusTerms ";
// import FiftyBonusTerms from "./Terms&condition/FiftyBonusTerms ";
import useBankDetails from "../hooks/useBankDetails";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";


export const BankTransfer = () => {
  const { data, loading } = useBankDetails(
    `${USER_API.GET_ADMIN_BANK_DETAILS}`,
    {
      method: "POST",
    },
  );

  console.log("Bank Details Data:", data); 

  const navigate = useNavigate();
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions, balanceData } = useUserContext();
  // const [balanceData,  setBalanceData] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [selectedImageName, setSelectedImageName] = useState("");

  // const [bonusChecked, setBonusChecked] = useState(false);
  // const [selectedBonus, setSelectedBonus] = useState("");

  const [showTermsModal, setShowTermsModal] = useState(false);
  // const [mt5_acc_list, setMt5_acc_list] = useState([]);
  // const [termsAndCondition, settermsAndCondition] = useState(false);

  // const [getBonusDiscount, setGetBonusDiscount] = useState();

  const [inputFields, setInputFields] = useState({
    mt5accountselect: "",
    amount: "",
    req_transaction_id: "",
    remark: "",
    deposit_type: "Bank Transfer",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState({
    otpMessage: "",
    confirmOTP: "",
  });

  const depositMethod = ["Bank Transfer"];
  // const requireTrades = selectedBonus == 50 ? inputFields.amount / 4 : 0;

  // const fetchBonusDiscount = async () => {
  //   try {
  //     const response = await axios.post(`${backendURL}/get_discounts.php`, {
  //       token: token,
  //     });
  //     // setGetBonusDiscount(response.data);
  //   } catch (err) {
  //     console.error("err -------->", err);
  //   }
  // };

  // const fetchBalanceData1 = async () => {
  //   try {
  //     const response = await axios.post(`${backendURL}/get_user_bal_data.php`, {
  //       token,
  //     });
  //     setBalanceData(response.data.data.response.balance);
  //   } catch (err) {
  //     console.error("err -------->", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchBalanceData();
  //   fetchBonusDiscount();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      const file = files[0];
      if (file && file.size > 2 * 1024 * 1024) {
        console.error("File size must be less than 2MB.");
        return;
      }
      setReceipt(file);
      setSelectedImageName(file.name);
    } else {
      setInputFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    Object.entries(inputFields).forEach(([key, val]) =>
      formData.append(key, val),
    );
    formData.append("receipt", receipt);
    // formData.append("enable_bonus", bonusChecked ? "1" : "0");
    // formData.append("enable_terms", termsAndCondition ? "1" : "0");

    // Conditional logic for selectedBonus
    // if (bonusChecked && selectedBonus) {
    //   formData.append("selectedbonus", selectedBonus);
    // }

    try {
      const response = await api.post(
        `${USER_API.DEPOSIT_FUNDS_ADD_WALLET_BAL}`,
        formData,
      );
      if (response.data.data.status === 200) {
        setToastMessage((prev) => ({
          ...prev,
          confirmOTP: response?.data?.data?.result,
        }));
        toast.success(response.data.data.result, toastOptions);
        navigate("/dashboard");
      } else {
        setToastMessage((prev) => ({
          ...prev,
          confirmOTP: response?.data?.data?.result,
        }));
        toast.error(response.data.data.result, toastOptions);
      }
    } catch (err) {
      console.error("err -------->", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Currently not using
  // useEffect(() => {
  //   const amount = parseFloat(inputFields.amount);
  //   if (bonusChecked) {
  //     if (amount >= 10 && amount <= 1000) {
  //       setSelectedBonus("50");
  //     } else {
  //       setSelectedBonus("");
  //     }
  //   }
  // }, [inputFields.amount, bonusChecked]);

  return (
    <>
      <section className="transition-all duration-300">
        <div className="rounded-lg text-start md:min-h-[83vh]">
          <div
            onClick={() => {
              if (isMobile && toggle) setToggle(false);
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-6xl">
              <div className="flex flex-col items-start gap-1">
                <h2 className="text-3xl font-bold text-gray-900">
                  Bank Transfer
                </h2>
                <span className="text-gray-500 font-normal text-base">
                  Deposit your funds via bank transfer
                </span>
              </div>
              <div>
                <BackButton customPath="/funds" />
              </div>
            </div>

            {/* Form Section */}
            <div className="flex gap-4 flex-col mt-3 lg:mb-[140px] lg:flex-row">
              <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg p-6">
                <form onSubmit={handleSubmit}>
                  <p className="text-sm font-medium pb-4">
                    Current Wallet Balance: $ {balanceData?.balance}
                  </p>

                  {/* Payment and Currency */}
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4`}>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment method
                      </label>
                      <select
                        required
                        name="deposit_type"
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent rounded-md p-2"
                      >
                        {depositMethod.map((elem, idx) => (
                          <option key={idx}>{elem}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full mt-4 sm:mt-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select className="w-full bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2">
                        <option>USD</option>
                      </select>
                    </div>
                    {/* <div className="w-full mt-4 sm:mt-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MT5 ID
                      </label>
                      <select
                        required
                        className="w-full bg-transparent border focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
                        name="mt5accountselect"
                        onChange={handleInputChange}
                        value={inputFields.mt5accountselect}
                      >
                        <option value="">Select Account</option>
                        {mt5_acc_list
                          ?.filter((item) => item.group_name !== "Demo")
                          .map((elem, index) => {
                            return (
                              <option key={index} value={elem.accno}>
                                {elem.accno}
                              </option>
                            );
                          })}
                      </select>
                    </div> */}
                  </div>

                  {/* Bank Details Card */}
                  {loading ? (
                    <div className="mb-6 animate-pulse">
                      <h3 className="text-md font-semibold text-gray-800 mb-3">
                        Bank Details
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i}>
                              <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                              <div className="h-4 w-36 bg-gray-300 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-6">
                      <h3 className="text-md font-semibold text-gray-800 mb-3">
                        Bank Details
                      </h3>
                      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                          <div>
                            <div className="text-gray-900">Bank Name:</div>
                            <div className="font-medium text-gray-500">
                              {data[0]?.bankname}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900">Account Holder:</div>
                            <div className="font-medium text-gray-500">
                              {data[0]?.accname}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900">Account No:</div>
                            <div className="font-medium text-gray-500">
                              {data[0]?.accno}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900">
                              IFSC/ Swift Code:
                            </div>
                            <div className="font-medium text-gray-500">
                              {data[0]?.ifsc}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-900">IBAN Number:</div>
                            <div className="font-medium text-gray-500">
                              {data[0]?.iban_number}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="flex items-stretch w-full">
                      <span className="flex items-center px-3 text-gray-700 border border-r-1 rounded-l-md bg-gray-50 text-sm font-semibold">
                        USD
                      </span>
                      <input
                        required
                        min="0"
                        step="0.01"
                        onWheel={(e) => e.target.blur()}
                        onChange={handleInputChange}
                        type="number"
                        name="amount"
                        onKeyDown={(e) => {
                          if (["e", "E", "+", "-"].includes(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        placeholder="0.00"
                        className="w-full border border-l-0 font-medium rounded-r-md text-black p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent"
                      />
                    </div>
                  </div>

                  {/* Bonus Checkbox & Inline Section */}
                  {/* {getBonusDiscount?.data?.status == 200 && (
                    <div className="mb-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-blue-600"
                          checked={bonusChecked}
                          onChange={() => setBonusChecked(!bonusChecked)}
                        />
                        <label className="ms-2 text-sm font-medium text-gray-700">
                          Enable Deposit Bonus
                        </label>
                      </div>
                       {bonusChecked && (
                        <div className="mt-4 border-2 rounded-xl p-4 transition-all duration-300 ease-in-out">
                          <div className="flex justify-between">
                            <h2 className="text-lg font-semibold mb-3">
                              Get Deposit Bonus
                            </h2>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">
                            Enter the amount to get the Deposit Bonus
                          </p>
                          {inputFields.amount >= 10 &&
                            inputFields.amount <= 1000 && (
                              <label
                                className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer mb-2 ${
                                  selectedBonus === "100"
                                    ? "border-blue-500 bg-blue-50"
                                    : "border-gray-300"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name="bonus"
                                    value="50"
                                    checked={selectedBonus === "50"}
                                    onChange={(e) =>
                                      setSelectedBonus(e.target.value)
                                    }
                                    className="accent-blue-600"
                                  />
                                  <span className="font-medium">50%</span>
                                </div>
                                <div className="flex gap-2">
                                  <span className="md:text-sm text-xs text-gray-500">
                                    Requires
                                    <span className="font-semibold text-black">
                                      {" "}
                                      {requireTrades}
                                    </span>{" "}
                                    Lots to Trades
                                  </span>
                                  <span
                                    className="text-blue-500 cursor-pointer text-xs border font-semibold rounded-full w-8 h-4 flex items-center justify-center"
                                    onClick={() => setShowTermsModal(true)}
                                  >
                                    T&C
                                  </span>
                                </div>
                              </label>
                            )}
                        </div>
                      )} 
                    </div>
                  )} */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Transaction Id
                    </label>
                    <input
                      required
                      name="req_transaction_id"
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Enter transaction Id"
                      className="w-full bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <input
                      name="remark"
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Enter remarks here"
                      className="w-full bg-transparent border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Receipt
                    </label>
                    <span className="text-sm text-[#667085]">
                      Upload photo of transaction receipt
                    </span>
                    <input
                      type="file"
                      name="receipt"
                      onChange={handleInputChange}
                      className="w-full bg-transparent border border-[#E9EAEB] focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
                    />
                  </div>
                  {toastMessage?.confirmOTP && (
                    <p className="text-red-500 text-sm mt-1">
                      {toastMessage?.confirmOTP}
                    </p>
                  )}
                  <div className="mb-6 leading-7 mt-2">
                    <label className="block text-md font-medium">
                      Accept Terms and Conditions
                      <p className=" text-md mt-1">By Clicking Make Deposit</p>
                    </label>
                    <p className="text-md mt-1">
                      You accept that you have read, Understood, and agree with
                      all the information in the Terms and Conditions of
                      Novotrend Ltd, including its Privacy Policy.
                    </p>
                  </div>
                  {/* {bonusChecked && getBonusDiscount?.data?.status == 200 && (
                    <div className="flex items-center mb-6 relative group">
                      <input
                        required
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm"
                        checked={termsAndCondition}
                        onChange={(e) => settermsAndCondition(e.target.checked)}
                      />
                      <label className="ms-2 text-sm font-medium text-black flex items-center">
                        I have Read, Understood and Agree to the Terms &
                        Conditions of the Deposit Bonus.
                        <div className="relative ml-1">
                          <span className="text-blue-500 cursor-pointer text-xs border font-semibold rounded-full w-8 h-4 flex items-center justify-center">
                            T&C
                          </span>
                          <div className="absolute left-5 top-[-10px] z-10 hidden group-hover:block w-64 text-xs text-white bg-gray-800 p-2 rounded shadow-md">
                            These are the terms and conditions for the deposit
                            bonus.
                          </div>
                        </div>
                      </label>
                    </div>
                  )} */}
                  <Hr />
                  <div className="flex justify-end space-x-2 mt-4">
                    <button type="button" className="btn-cancel">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-4 py-2 rounded-md 
                                 text-white 
                                 bg-blue-600 hover:bg-blue-700 
                                 disabled:bg-gray-300 disabled:text-gray-500 
                                 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Processing..." : "Make Deposit"}
                    </button>
                  </div>
                </form>
              </div>
              {/* no requirment yet we can remove in future */}
              {/* <div className="lg:w-1/4 w-full h-fit bg-white border rounded-lg shadow-sm p-6 mt-4 lg:mt-0">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  Terms
                </h2>
                <p className="text-sm text-[#181D27]">
                  <span className="font-medium text-[#667085]">
                    Average payment time:
                  </span>{" "}
                  Instant
                </p>
                <p className="text-sm text-[#181D27]">
                  <span className="font-medium text-[#667085]">Fees:</span> 0%
                </p>
                <hr className="my-4 border-gray-200" />
              </div> */}
            </div>
          </div>
        </div>
      </section>
      {showTermsModal && (
        <div className="fixed top-0 inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white max-w-xl w-full rounded-xl shadow-lg overflow-y-auto max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                Terms & Conditions
              </h2>
              <button
                className="text-gray-500 hover:text-red-500 text-lg"
                onClick={() => setShowTermsModal(false)}
              >
                ✕
              </button>
            </div>
            {/* <div className="p-4">
              {selectedBonus === "50" ? (
                <FiftyBonusTerms />
              ) : (
                <HundredBonusTerms />
              )}
            </div> */}
          </div>
        </div>
      )}
    </>
  );
};
