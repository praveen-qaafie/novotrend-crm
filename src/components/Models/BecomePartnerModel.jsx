/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/userContext";

const BecomePartnerModal = ({ onClose }) => {
  const { becomePartner, loading, fetchBalanceData, partnerData } =
    useUserContext();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  const handleSubmit = async () => {
    try {
      const res = await becomePartner(accepted);

      if (res?.status === 200) {
        // Successfully became partner
        setTimeout(() => {
          navigate("/partner");
          onClose();
        }, 600);
      } else if (res?.status === 202) {
        // Pending request — stay on dashboard
        setTimeout(() => {
          navigate("/dashboard");
          onClose();
        }, 600);
      }
    } catch (err) {
      console.error("Error submitting partner request:", err);
    }
  };

  useEffect(() => {
    fetchBalanceData();
  }, [partnerData]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Become a Partner
        </h3>
        <p className="text-gray-950 mb-4">
          Please accept the Term & Conditions to become a Novotrend Partner!
        </p>

        <div className="flex items-start gap-2 mb-4">
          <input
            type="checkbox"
            id="terms"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-1 p-3"
          />
          <label htmlFor="terms" className="text-sm text-gray-700">
            Accept Terms and Conditions.
          </label>
        </div>

        <p className="text-xs text-gray-500 mb-6">
          By clicking <strong>Become Partner</strong>, you confirm you have read
          and agree to the Terms & Conditions of Novotrend Ltd, including its
          Privacy Policy.
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="btn-cancel" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!accepted}
            className={`px-4 py-2 rounded text-white transition-colors ${
              accepted
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-300 cursor-not-allowed"
            }`}
          >
            {loading ? "Processing..." : "Become Partner"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default BecomePartnerModal;