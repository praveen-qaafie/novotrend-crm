import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { BiSupport } from "react-icons/bi";
import { Header } from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useSidebar } from "../context/SidebarContext";
import { useUserContext } from "../context/userContext";
import PromotionCard from "../components/ui/PromotionCard";
import DashboardSidebar from "../components/Sidebar/DashboardSidebar";
// import NotificationModal from "../components/Notification/NotificationModal";

const Layout = ({ children }) => {
  const { toggle, isMobile } = useSidebar();
  const { userInfo, balanceData, isLoading } = useUserContext();
  const [HideBalance, setHideBalance] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const location = useLocation();

  console.log("userInfo", userInfo);

  const withoutPromotionCard = [
    "/transaction-history",
    "/Trading-History/",
    "/treadingtools",
    "/treadingtools/market",
    "/treadingtools/economy",
  ];

  const shouldShowPromotionCard = !withoutPromotionCard.includes(
    location.pathname,
  );

  useEffect(() => {
    if (isMobile && toggle) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMobile, toggle]);

  if (isLoading && (!userInfo || !balanceData)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <h3>Loading...</h3>
        </div>
      </div>
    );
  }

  if (!isLoading && (!userInfo || !balanceData)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div>
          <h3>Getting The Dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50">
      {/* <NotificationModal /> */}
      <Header
        user={userInfo}
        balanceData={balanceData}
        HideBalance={HideBalance}
        setHideBalance={setHideBalance}
      />
      <div className={`flex ${isMobile ? "ml-0" : toggle ? "ml-64" : "ml-20"}`}>
        <DashboardSidebar
          user={userInfo}
          balanceData={balanceData}
          HideBalance={HideBalance}
          setHideBalance={setHideBalance}
        />

        <main className="container overflow-y-auto w-full min-h-screen p-6 lg:pt-32 pt-24">
          {children}
          <Footer />
        </main>
        {shouldShowPromotionCard && (
          <>
            <div className="hidden 3xl:block fixed mt-[130px] right-16 z-30">
              <PromotionCard />
            </div>

            <button
              onClick={() => setShowPromo(!showPromo)}
              className="hidden sm:flex 3xl:hidden
                        items-center gap-2
                        fixed top-[14%]
                        right-0
                        bg-blue-500 text-white
                        px-3 py-2 rounded-l-xl shadow-md
                        hover:bg-blue-600 transition-all
                        animate-slide z-40"
            >
              <BiSupport size={18} />
            </button>
            {showPromo && (
              <div
                className="hidden sm:block 3xl:hidden
                           fixed top-[20%]
                           right-3
                           z-50
                           animate-slide
                           "
              >
                <PromotionCard />
                {/* <button
                  onClick={() => setShowPromo(false)}
                  className="absolute -top-3 -right-3 bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center shadow hover:bg-red-600"
                >
                  ✕
                </button> */}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Layout;
