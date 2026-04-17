import { useState } from "react";
import { PartnerHeader } from "../components/Header/PartnerHeader";
import { Outlet } from "react-router-dom";
import { useSidebar } from "../context/SidebarContext";
import PartnerSidebar from "../components/Sidebar/PartnerSidebar";
import { useUserContext } from "../context/useUserContext";

const PartherDashboardLayout = () => {
  const { toggle, isMobile } = useSidebar();
  const { balanceData } = useUserContext();
  // const [balanceData, setBalanceData] = useState(null);
  const [HideBalance, setHideBalance] = useState(false);

  // const fetchBalanceData = async () => {
  //   try {
  //     const response = await axios.post(`${backendURL}/get_user_bal_data.php`, {
  //       token: token,
  //     });
  //     setBalanceData(response.data.data.response);
  //   } catch (err) {
  //     console.error("err -------->", err);
  //   }
  // };

  // useEffect(() => {
  //   fetchBalanceData();
  // }, []);

  return (
    <div className="w-full">
      <PartnerHeader
        balanceData={balanceData}
        HideBalance={HideBalance}
        setHideBalance={setHideBalance}
      />
      <div className={`flex ${isMobile ? "ml-0" : toggle ? "ml-64" : "ml-20"}`}>
        <PartnerSidebar />
        <div className="container overflow-y-auto w-full min-h-screen p-6  pt-24">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default PartherDashboardLayout;
