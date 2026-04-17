/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useCallback } from "react";
import {
  ProgressStepper,
  PartnerDashboardSection,
  PartnerLoyaltyProgram,
} from "./PartnerDashobard";
import { toast } from "react-toastify";
import { useUserContext } from "../context/useUserContext";
import { PARTNER_DASHBOARD } from "../utils/constants";
import api from "../utils/axiosInstance";

function PartherDashboard() {
  const [userData, setuserData] = useState();
  const [loading, setLoading] = useState(false);
  const { toastOptions } = useUserContext();

  // const getIbDashboard = useCallback(async () => {
  //   setLoading(true);

  //   try {
  //     const resp = await api.post(`${PARTNER_DASHBOARD.GET_PARTNER_DASHBOARD}`);

  //     const apiResp = resp.data.data;

  //     if (apiResp?.status === 200) {
  //       setuserData(apiResp?.response);
  //     } else {
  //       toast.error(apiResp?.result, toastOptions);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching IB Dashboard:", error);
  //     toast.error("Something went wrong!", toastOptions);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [toastOptions, setuserData]);

  // useEffect(() => {
  //   getIbDashboard();
  // }, [getIbDashboard]);

  const getIbDashboard = async () => {
    setLoading(true);
    try {
      const resp = await api.post(PARTNER_DASHBOARD.GET_PARTNER_DASHBOARD);
      const apiResp = resp.data.data;

      if (apiResp?.status === 200) {
        setuserData(apiResp?.response);
      } else {
        toast.error(apiResp?.result, toastOptions);
      }
    } catch (error) {
      toast.error("Something went wrong!", toastOptions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIbDashboard();
  }, []);

  return (
    <div className="w-full h-auto">
      {/* ProgressStepper Progress Section */}
      <section title="Verification section working" className="p-6">
        <ProgressStepper userData={userData} loading={loading} />
      </section>

      {/* Partner Balance + Level Section */}
      <section title="Partner Dashboard Section top" className="px-6  py-3">
        <PartnerDashboardSection userData={userData} />
      </section>

      {/* Loyalty Program Section */}
      <section title="Partner Loyalty Programm" className="p-6">
        <PartnerLoyaltyProgram userData={userData} />
      </section>
    </div>
  );
}

export default PartherDashboard;
