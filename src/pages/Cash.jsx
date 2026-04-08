import { useState } from "react";
import { Hr } from "../components/Common/Hr";
import { toast } from "react-toastify";
import { useUserContext } from "../context/userContext";
import { useSidebar } from "../context/SidebarContext";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/ui/BackButton";
import { USER_API } from "../utils/constants";
import api from "../utils/axiosInstance";
// import HundredBonusTerms from "./Terms&condition/HundredBonusTerms ";
// import FiftyBonusTerms from "./Terms&condition/FiftyBonusTerms ";


export const Cash = () => {
  const navigate = useNavigate();
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions } = useUserContext();
  const token = localStorage.getItem("userToken");

  const [inputFields, setInputFields] = useState({
    token: token,
    mt5accountselect: "",
    amount: "",
    remark: "",
    deposit_type: "Cash",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // const [bonusChecked, setBonusChecked] = useState(false);
  // const [selectedBonus, setSelectedBonus] = useState("");
  // const [mt5_acc_list, setMt5_acc_list] = useState([]);
  const [showTermsModal, setShowTermsModal] = useState(false);
  // const [termsAndCondition, settermsAndCondition] = useState(false);

  // const [getBonusDiscount, setGetBonusDiscount] = useState();
  const depositMethod = ["Cash"];

  const [toastMessage, setToastMessage] = useState({
    otpMessage: "",
    confirmOTP: "",
  });

  // const requireTrades = selectedBonus == 50 ? inputFields.amount / 4 : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  // const fetchBonusDiscount = async () => {
  //   try {
  //     const response = await axios.post(`${backendURL}/get_discounts.php`, {
  //       token: token,
  //     });
  //     setGetBonusDiscount(response.data);
  //   } catch (err) {
  //     console.error("err -------->", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchBonusDiscount();
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    const payload = {
      ...inputFields,
      // selectedbonus: selectedBonus,
      // enable_terms: termsAndCondition ? "1" : "0",
      // enable_bonus: bonusChecked ? "1" : "0",
    };

    try {
      const response = await api.post(
        `${USER_API.DEPOSIT_FUNDS_ADD_WALLET_BAL_CASH}`,
        payload,
      );

      if (response.data.data.status === 200) {
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
      <section className={`transition-all duration-300 lg:mb-[200px]`}>
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
                  Cash Deposit
                </h2>
                <span className="text-gray-500 font-normal text-base">
                  Deposit your funds via cash
                </span>
              </div>
              <div>
                <BackButton customPath={"/funds"} />
              </div>
            </div>
            {/* Main Row: Form and Terms */}
            <div className="flex gap-4 flex-col mt-3 mb-10 lg:flex-row">
              {/* Form Card */}
              <div className="w-full max-w-6xl bg-white border rounded-lg shadow-sm hover:shadow-lg transition-shadow p-6 text-start">
                <form onSubmit={handleSubmit}>
                  <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4`}>
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment method
                      </label>
                      <select
                        required
                        onChange={handleInputChange}
                        name="deposit_type"
                        className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        {depositMethod?.map((elem, index) => (
                          <option key={index}>{elem}</option>
                        ))}
                      </select>
                    </div>
                    <div className="w-full mt-4 sm:mt-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Currency
                      </label>
                      <select className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                        <option>USD</option>
                      </select>
                    </div>
                    {/* {bonusChecked && (
                      <div className="w-full mt-4 sm:mt-0">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          MT5 ID
                        </label>
                        <select
                          required
                          name="mt5accountselect"
                          className="w-full bg-transparent border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          onChange={handleInputChange}
                          value={inputFields.mt5accountselect}
                        >
                          <option value="">Select Account</option>
                          {mt5_acc_list
                            ?.filter((item) => item.group_name !== "Demo")
                            .map((elem, index) => (
                              <option key={index} value={elem.accno}>
                                {elem.accno}
                              </option>
                            ))}
                        </select>
                      </div>
                    )} */}
                  </div>
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
                  {/* {getBonusDiscount?.data?.status === 200 && (
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
                      {bonusChecked &&
                        getBonusDiscount?.data?.status === 200 && (
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

                  {/* Remarks */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Remarks
                    </label>
                    <input
                      onChange={handleInputChange}
                      type="text"
                      name="remark"
                      placeholder="Enter remarks here"
                      className="w-full bg-transparent border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  {toastMessage?.confirmOTP && (
                    <p className="text-red-500 text-sm mt-1">
                      {toastMessage?.confirmOTP}
                    </p>
                  )}
                  <div className="mb-4 leading-7 mt-2">
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
                  {/* {bonusChecked && getBonusDiscount?.data?.status === 200 && (
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
                  {/* Buttons */}
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
              {/* No requirment yet Terms Card */}
              {/* <div className="lg:w-1/4 w-full h-fit bg-white border rounded-lg shadow-sm p-6 mt-4 lg:mt-0">
                <div className="mb-6 text-start">
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
                </div>
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
