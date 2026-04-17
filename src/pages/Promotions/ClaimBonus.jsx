import { useState, useEffect } from "react";
import { useUserContext } from "../../context/useUserContext";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axiosInstance";
import { USER_API } from "../../utils/constants";

const ClaimBonus = () => {
  const navigate = useNavigate();
  const { toastOptions } = useUserContext();

  const [activeTab, setActiveTab] = useState("available");

  // const [depositBonusData, setDepositBonusData] = useState([]);
  const [activeBonuses, setActiveBonuses] = useState([]);
  const [cancelActiveBonus, setCancelActiveBonus] = useState("");
  const [loading, setLoading] = useState(false);

  const [applyBonus, setApplyBonus] = useState();

  const [mt5_acc_list, setMt5_acc_list] = useState([]);

  const [getBonusDiscount, setGetBonusDiscount] = useState();

  const [confirmModal, setConfirmModal] = useState({
    open: false,
    amount: null,
    accno: null,
    selectedbonus: null,
  });

  const [cancelModal, setCancelModal] = useState({
    open: false,
    depositId: null,
  });

  const [completedModal, setCompletedModal] = useState({
    open: false,
    mt5accountselect: null, // new one
  });

  const fetchBonusDiscount = async () => {
    try {
      const response = await api.post(`${USER_API.GET_DISCOUNT}`);
      setGetBonusDiscount(response.data);
    } catch (err) {
      console.error("err -------->", err);
    }
  };

  // const fetchClaimBonusData = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await axios.post(
  //       `${backendURL}/get_deposit_account.php`,
  //       { token: token }
  //     );
  //     setDepositBonusData(response.data.data.response);
  //   } catch (err) {
  //     console.error("Error fetching deposit bonus data:", err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const applyClaimBonus = async ({ amount, accno, selectedbonus }) => {
    if (amount === 0 || amount > 5000 || amount < 10) {
      toast.error("No Deposit Available", toastOptions);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`${USER_API.ADD_DEPOSIT_BONUS}`, {
        amount: amount,
        deposit_type: "",
        mt5accountselect: accno,
        selectedbonus: selectedbonus,
        enable_bonus: 1,
        enable_terms: 1,
      });

      setApplyBonus(response.data.data.response);
      toast.success("Bonus applied successfully.", toastOptions);
      setActiveTab("active");
      fetchBonusDiscount(); // Refresh here
      fetchActiveBonuses(); // Refresh here
    } catch (err) {
      console.error("Error applying claimBonus:", err);
      toast.error(
        "Something went wrong while applying the bonus.",
        toastOptions,
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveBonuses = async () => {
    setLoading(true);
    try {
      const response = await api.post(`${USER_API.GET_ACTIVE_USER_BONUS}`);
      setActiveBonuses(response.data.data.response);
    } catch (err) {
      console.error("Error fetching active bonuses:", err);
    } finally {
      setLoading(false);
    }
  };

  const cancelDepositBonus = async (deposit_id) => {
    setLoading(true);
    try {
      const response = await api.post(`${USER_API.CANCEL_ACTIVE_BONUS}`, {
        deposit_id,
      });
      setCancelActiveBonus(response.data.data.response);
      toast.success("Cancel bonus request sent successfully.", toastOptions);
      fetchActiveBonuses(); // refresh
    } catch (err) {
      console.error("Error cancelling bonus:", err);
    } finally {
      setLoading(false);
    }
  };

  const getMt5Acc = async () => {
    try {
      await api.post(`${USER_API.MT5_ACCOUNT_LIST}`).then((resp) => {
        const apiResp = resp.data.data;
        if (apiResp.status === 200) {
          setMt5_acc_list(apiResp.response);
        } else {
          toast.error(apiResp.result, toastOptions);
        }
      });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const checkMT5Balance = async (mt5Account) => {
    try {
      const response = await api.post(`${USER_API.CHECK_MT5_ACC_BALANCE}`, {
        mt5accountselect: mt5Account,
      });
      return response.data;
    } catch (error) {
      toast.error("Failed to check MT5 balance.");
    }
  };

  useEffect(() => {
    // fetchClaimBonusData();
    fetchActiveBonuses();
    fetchBonusDiscount(); // new api call
    getMt5Acc();
  }, []);

  return (
    <>
      {/* Confirmation model for apply bonus */}
      {confirmModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Bonus Application
            </h3>
            <p className="text-md text-gray-600 mb-6">
              Are you sure you want to apply the bonus?
            </p>
            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => setConfirmModal({ open: false })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  applyClaimBonus({
                    amount: confirmModal.amount,
                    accno: confirmModal.accno,
                    selectedbonus: confirmModal.selectedbonus,
                  });
                  setConfirmModal({ open: false });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel modelPopup */}
      {cancelModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">
              Confirm Bonus Cancellation
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Do you really wish to cancel the deposit bonus?
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Your Deposit Bonus Amount Balance will be deducted by ${" "}
              <span className="font-medium text-black">
                {Number(cancelModal.bonusAmount || 0).toFixed(2)}
              </span>
            </p>

            <div className="flex justify-center gap-3">
              <button
                className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
                onClick={() => setCancelModal({ open: false })}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={async () => {
                  await cancelDepositBonus(cancelModal.depositId);
                  setCancelModal({ open: false });
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation model  */}
      {completedModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4 text-black-700">
              🎉 Bonus Completed
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              You have Successfully Achieved the Required Trading Lots. Click on
              Confirm to Withdraw the Amount
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Your Balance:{" "}
              <strong>
                {" "}
                {completedModal?.groupid === 9 ? "$" : "¢"}{" "}
                {completedModal.balance}
              </strong>{" "}
            </p>
            <div className="flex justify-center">
              <button
                className="px-4 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setCompletedModal({ open: false });
                  navigate("/funds/mt5-to-wallet");
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full max-w-[960px] bg-white rounded-2xl shadow p-6 mb-5 mb-[180px]">
        <h2 className="text-2xl font-bold mb-2">Your Deposit Bonuses</h2>
        <p className="text-gray-600 mb-4">
          Deposit in your account and we will give you 50% Bonus to its amount
          for free with required trading lots.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-300 mt-7">
          <button
            className={`mr-6 pb-2 text-sm font-semibold ${
              activeTab === "available"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("available")}
          >
            AVAILABLE DEPOSIT BONUSES
          </button>
          <button
            className={`pb-2 text-sm font-semibold ${
              activeTab === "active"
                ? "text-blue-700 border-b-2 border-blue-700"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("active")}
          >
            ACTIVE AND CANCELLED BONUSES
          </button>
        </div>

        {/* Available Bonuses Table */}
        {activeTab === "available" && (
          <>
            {getBonusDiscount?.data.result !== "Discount already given" ? (
              <div className="mt-5">
                <p className="text-gray-500 mb-2 text-sm">
                  This is a list of all your available deposit bonuses. By
                  clicking <strong> Apply </strong> You agree to Terms and
                  Conditions of the Deposit Bonus to claim.
                </p>
                <div className="overflow-x-auto mt-4 border border-gray-200 rounded-lg">
                  <table className="min-w-[700px] w-full text-sm text-center border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="py-3 px-4 border-r border-gray-200">
                          MT5 ID
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Amount
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Required Lots
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Bonus
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Bonus Amount
                        </th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-6 text-blue-600 text-center"
                          >
                            <FiLoader className="animate-spin inline-block mr-2" />
                            Loading...
                          </td>
                        </tr>
                      )}

                      {!loading &&
                        mt5_acc_list
                          ?.filter((item) => item.group_name !== "Demo")
                          .map((elem, index) => {
                            const isCent = elem.group_name === "Cent";
                            const displayAmount = isCent
                              ? elem.amount / 100
                              : elem.amount;

                            // const RequiredLots =
                            //   displayAmount < 10 || displayAmount > 5000
                            //     ? 0
                            //     : displayAmount <= 1000
                            //     ? displayAmount / 2
                            //     : displayAmount / 4;

                            const RequiredLots =
                              displayAmount < 10 || displayAmount > 1000
                                ? 0
                                : displayAmount <= 1000
                                  ? displayAmount / 2
                                  : 0;

                            // const bonus =
                            //   displayAmount >= 10 && displayAmount <= 1000
                            //     ? 100
                            //     : displayAmount > 1000 && displayAmount <= 5000
                            //     ? 50
                            //     : 0; 4967.04

                            const bonus =
                              displayAmount >= 10 && displayAmount <= 1000
                                ? 50
                                : 0;

                            const bonusAmount = (displayAmount * bonus) / 100;

                            return (
                              <>
                                {displayAmount >= 10 &&
                                  displayAmount <= 1000 && (
                                    <tr
                                      key={index}
                                      className="border-t border-gray-200"
                                    >
                                      <td className="py-3 px-4 border-r border-gray-100">
                                        {elem.accno}
                                      </td>
                                      <td className="py-3 px-4 border-r border-gray-100">
                                        {Number(displayAmount).toFixed(2)}
                                      </td>
                                      <td className="py-3 px-4 border-r border-gray-100">
                                        {Number(RequiredLots).toFixed(2)}
                                      </td>
                                      <td className="py-3 px-4 border-r border-gray-100">
                                        {bonus}%
                                      </td>
                                      <td className="py-3 px-4 border-r border-gray-100">
                                        {Number(bonusAmount).toFixed(2)}
                                      </td>
                                      <td className="py-3 px-4">
                                        <button
                                          type="button"
                                          className="border px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md hover:text-white-700"
                                          onClick={() =>
                                            setConfirmModal({
                                              open: true,
                                              amount: displayAmount,
                                              accno: elem.accno,
                                              selectedbonus: bonus,
                                            })
                                          }
                                        >
                                          Apply
                                        </button>
                                      </td>
                                    </tr>
                                  )}
                              </>
                            );
                          })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-2">
                No Deposit Bonus Available Today. Please Visit Again!
              </p>
            )}
          </>
        )}

        {/* Active and Cancelled Bonuses Table */}
        {activeTab === "active" && (
          <>
            {activeBonuses.length !== 0 ? (
              <div className="text-gray-500 text-sm">
                <p className="mb-2 mt-5">
                  This is a list of all your received and cancelled deposit
                  bonuses. Here you can cancel your bonus.
                </p>
                <p className="text-black text-md mt-5">
                  A bonus amount will be added to your account balance and will
                  become withdrawable automatically after you trade the required
                  volume.
                </p>

                <div className="overflow-x-auto mt-4 border border-gray-200 rounded-lg">
                  <table className="min-w-[700px] w-full text-sm text-center border-collapse">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="py-3 px-4 border-r border-gray-200">
                          MT5 ID
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Deposit Amount
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Bonus Amount
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Achieved Lots
                        </th>
                        <th className="py-3 px-4 border-r border-gray-200">
                          Required Lots
                        </th>
                        <th className="py-3 px-4">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && (
                        <tr>
                          <td
                            colSpan="6"
                            className="py-6 text-blue-600 text-center"
                          >
                            <FiLoader className="animate-spin inline-block mr-2" />
                            Loading...
                          </td>
                        </tr>
                      )}
                      {activeBonuses.map((bonus) => {
                        const requiredLots = Number(
                          bonus.disc_amount / 2,
                        ).toFixed(2);
                        // const achievedLots = (bonus.lots_achieved = 2.50);
                        const achievedLots = bonus.lots_achieved;
                        return (
                          <tr
                            key={bonus.deposit_id}
                            className="border-t border-gray-200"
                          >
                            <td className="py-3 px-4 border-r border-gray-100">
                              {bonus.accno}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100">
                              {Number(bonus.amount || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100">
                              {Number(bonus.disc_amount || 0).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100">
                              {Number(bonus.lots_achieved).toFixed(2)}
                            </td>
                            <td className="py-3 px-4 border-r border-gray-100">
                              {requiredLots || 0}
                            </td>
                            <td className="py-3 px-4">
                              {achievedLots == requiredLots ? (
                                <button
                                  type="button"
                                  className="border px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md"
                                  onClick={async () => {
                                    const result = await checkMT5Balance(
                                      bonus.accno,
                                    );
                                    const balances =
                                      result?.data?.response?.map((item) => ({
                                        balance: item.balance,
                                        groupid: item.groupid,
                                      }));

                                    if (result?.data?.status === 200) {
                                      setCompletedModal({
                                        open: true,
                                        balance: balances?.[0]?.balance,
                                        groupid: balances?.[0]?.groupid,
                                      });
                                    }
                                  }}
                                >
                                  Completed
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="border px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md hover:text-white-700"
                                  onClick={() =>
                                    setCancelModal({
                                      open: true,
                                      depositId: bonus.deposit_id,
                                      bonusAmount: bonus.disc_amount,
                                    })
                                  }
                                >
                                  Cancel
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <p className="mt-2">No Records Found...</p>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ClaimBonus;
