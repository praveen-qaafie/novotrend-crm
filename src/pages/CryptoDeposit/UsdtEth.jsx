/* eslint-disable no-unused-vars */
import { useState } from "react";
import { toast } from "react-toastify";
import { useSidebar } from "../../context/SidebarContext";
import { useUserContext } from "../../context/useUserContext";
import BackButton from "../../components/ui/BackButton";
import { Hr } from "../../components/Common/Hr";
import { USER_API } from "../../utils/constants";
import api from "../../utils/axiosInstance";
// import HundredBonusTerms from "../Terms&condition/HundredBonusTerms ";
// import FiftyBonusTerms from "../Terms&condition/FiftyBonusTerms ";

// const backendURL = import.meta.env.VITE_API_URL;

const UsdtBep = () => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { toastOptions } = useUserContext();
  const [bonusChecked, setBonusChecked] = useState(false);
  // const [selectedBonus, setSelectedBonus] = useState("");
  const [termsAndCondition, settermsAndCondition] = useState(false);
  // const [showTermsModal, setShowTermsModal] = useState(false);
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [walletGenerated, setWalletGenerated] = useState(false);

  const [getBonusDiscount, setGetBonusDiscount] = useState();

  const [inputFields, setInputFields] = useState({
    mt5accountselect: "",
    amount: "",
  });

  const [toastMessage, setToastMessage] = useState({
    otpMessage: "",
    confirmOTP: "",
  });

  // const requireTrades = selectedBonus == 50 ? inputFields.amount / 4 : 0;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputFields((prev) => ({ ...prev, [name]: value }));
  };

  // Not using currently
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
  //   getMt5Acc();
  //   fetchBonusDiscount();
  // }, []);

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

  const sendUsdt = async () => {
    const { amount, mt5accountselect } = inputFields;

    if (bonusChecked && !mt5accountselect) {
      toast.error("Please select an MT5 ID", toastOptions);
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0", toastOptions);
      return;
    }
    setLoading(true);
    try {
      const endpoint = `${USER_API.GENERATE_WALLECT_ETHEREUM}`;
      const payload = {
        ...inputFields,
        enable_bonus: bonusChecked ? "1" : "0",
        enable_terms: termsAndCondition ? "1" : "0",
        // selectedbonus: selectedBonus,
      };

      const res = await api.post(`${endpoint}`, payload);

      if (res.data?.data?.status === 200) {
        setApiData(res.data.data.response);
        setToastMessage((prev) => ({
          ...prev,
          confirmOTP: res?.data?.data?.result,
        }));
        setWalletGenerated(true);
        toast.success("Wallet generated successfully", toastOptions);
      } else {
        setToastMessage((prev) => ({
          ...prev,
          confirmOTP: res?.data?.data?.result,
        }));
        toast.error(res.data.data.result, toastOptions);
        setApiData(null);
        toast.error(
          res.data?.data?.result || "Failed to generate wallet",
          toastOptions,
        );
      }
    } catch (err) {
      setApiData(null);
      toast.error("Something went wrong. Please try again.", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section className="transition-all duration-300">
        <div className="rounded-lg text-start md:min-h-[83vh]">
          <div onClick={() => isMobile && toggle && setToggle(false)}>
            <div className="flex items-center justify-between gap-1 mb-2 w-full max-w-[1118px]">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Deposit USDT
                </h2>
                <span className="text-gray-500 font-normal text-base">
                  Deposit your funds via USDT (Crypto Wallet)
                </span>
              </div>
              <BackButton customPath="/funds" />
            </div>

            <div className="flex flex-col gap-6 mt-3 mb-10 lg:flex-row lg:items-start">
              {/* Left Form */}
              <div className="w-full max-w-6xl lg:w-3/4 bg-white border rounded-lg shadow-sm hover:shadow-lg p-6">
                {/* Inputs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="mb-4 w-full sm:w-3/5 mt-4 sm:mt-0">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount
                    </label>
                    <div className="flex items-center">
                      <span className="py-2 px-3 text-gray-700 border border-r-0 rounded-l-lg">
                        USD
                      </span>
                      <input
                        required
                        min="0"
                        step="0.01"
                        onWheel={(e) => e.target.blur()}
                        type="number"
                        name="amount"
                        placeholder="0.00"
                        value={inputFields.amount}
                        onChange={handleInputChange}
                        className="flex-1 border font-medium rounded-r-lg text-gray-700 p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-transparent"
                      />
                    </div>
                  </div>
                  {/* {bonusChecked && (
                    <div className="w-full sm:w-3/5 mt-4 sm:mt-0">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        MT5 ID
                      </label>
                      <select
                        required
                        name="mt5accountselect"
                        value={inputFields.mt5accountselect}
                        onChange={handleInputChange}
                        className="w-full bg-transparent border rounded-md p-2"
                      >
                        <option value="" disabled hidden>
                          Select Account
                        </option>
                        {mt5_acc_list
                          .filter((acc) => acc.group_name !== "Demo")
                          .map((acc, i) => (
                            <option key={i} value={acc.accno}>
                              {acc.accno}
                            </option>
                          ))}
                      </select>
                    </div>
                  )} */}
                </div>

                {/* Bonus Section */}
                {getBonusDiscount?.data?.status === 200 && (
                  <div className="my-2">
                    {!walletGenerated && (
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
                    )}
                    {/* Bouns is not required currently  */}
                    {/* {bonusChecked && !walletGenerated && (
                      <div className="mt-4 border-2 rounded-xl p-4">
                        <h2 className="text-lg font-semibold mb-3">
                          Get Deposit Bonus
                        </h2>
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
                    )} */}
                  </div>
                )}
                {/* Wallet Output or Loader */}
                {loading && (
                  <div className="mt-4 text-sm text-blue-600">
                    Generating wallet, please wait...
                  </div>
                )}
                {apiData?.walletaddress && !loading && (
                  <div className="w-full">
                    <div className="mt-2 flex justify-center sm:justify-start">
                      <img
                        src={apiData.walletscanima}
                        alt="wallet QR"
                        className="w-64 max-w-full h-auto rounded-md shadow"
                      />
                    </div>
                    <hr className="my-4 border-gray-200" />
                    <label className="block text-md font-semibold text-gray-700 mb-1">
                      Address
                    </label>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                      <span className="block text-gray-700 mb-2 sm:mb-0 break-words max-w-full bg-gray-100 p-2 rounded text-sm overflow-x-auto">
                        {apiData.walletaddress}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(apiData.walletaddress);
                          // toast.success("Wallet Address copied successfully", toastOptions);
                        }}
                        className="px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full sm:w-auto"
                      >
                        Copy Address
                      </button>
                    </div>
                  </div>
                )}
                {toastMessage?.confirmOTP && (
                  <p className="text-red-500 text-sm mt-1">
                    {toastMessage?.confirmOTP}
                  </p>
                )}
                <div className="mb-6 leading-7 mt-2">
                  <label className="block text-md font-medium font-semibold ">
                    Accept Terms and Conditions
                    <p className=" text-md mt-1">By Clicking Make Deposit</p>
                  </label>
                  <p className="text-md mt-1">
                    You accept that you have read, Understood, and agree with
                    all the information in the Terms and Conditions of Novotrend
                    Ltd, including its Privacy Policy.
                  </p>
                </div>
                {/* Terms Agreement */}
                {/* {bonusChecked && !walletGenerated && (
                  <div className="flex items-center mb-6 mt-6">
                    <input
                      required
                      type="checkbox"
                      className="w-4 h-4"
                      checked={termsAndCondition}
                      onChange={(e) => settermsAndCondition(e.target.checked)}
                    />
                    <label className="ms-2 text-sm text-black">
                      I have Read and Agree to the Deposit Bonus T&C.
                    </label>
                  </div>
                )} */}
                <Hr />
                {/* Action Buttons */}
                {!walletGenerated && (
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={sendUsdt}
                      // disabled={bonusChecked && !termsAndCondition}
                      disabled={!inputFields.amount}
                      className="px-4 py-2 rounded-md text-white 
                        bg-blue-600 hover:bg-blue-700 
                        disabled:bg-gray-300 disabled:text-gray-500 
                        disabled:cursor-not-allowed"
                    >
                      {loading ? "Generating..." : "Make Deposit"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal, Not using currently */}
      {/* {showTermsModal && (
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
            <div className="p-4">
              {selectedBonus === "50" ? (
                <FiftyBonusTerms />
              ) : (
                <HundredBonusTerms />
              )}
            </div>
          </div>
        </div>
      )} */}
    </>
  );
};

export default UsdtBep;
