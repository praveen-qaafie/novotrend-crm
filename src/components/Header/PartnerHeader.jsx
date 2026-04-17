import DropdownWrapperPartner from "../ui/DropdownWrapperPartner";
import DropdownWrapperNotification from "../ui/DropdownWrapperNotification";
import NotificationDrawer from "../ui/NotificationDrawer";
import useNotifications from "../../hooks/useNotifications";
import partnerLogo from "../../../src/assets/img/NovoPartnersLogo.png";
import { LuWallet } from "react-icons/lu";
import { Link } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import { FaPeopleGroup } from "react-icons/fa6";
// import { ActiveUserContext } from "../../context/useUserContext";
import { IoMenu, IoCloseSharp } from "react-icons/io5";
import {
  FaRegBell,
  FaChartBar,
  FaPercent,
  FaHeadset,
  FaSignOutAlt,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa";
import { MdKeyboardArrowDown, MdOutlineDashboard } from "react-icons/md";
// import { BsGlobe } from "react-icons/bs";
import { MdDashboard } from "react-icons/md";
import { useState } from "react";
import { maskEmail } from "../../utils/makingEmail";
import useLogoutHandler from "../../hooks/useLogout";
import { PARTNER_DASHBOARD } from "../../utils/constants";
import { useUserContext } from "../../context/useUserContext";

export const PartnerHeader = ({ balanceData, setHideBalance, HideBalance }) => {
  const { userInfo } = useUserContext();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expanded, setExpanded] = useState({});
  // const { toastOptions } = useContext(ActiveUserContext);
  const { handleLogOut } = useLogoutHandler();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const userImg = "https://ui-avatars.com/api/?name=User";
  const partnerURL = `${PARTNER_DASHBOARD.GET_USER_PARTNER_NOTIFICATION}`;

  const { notifications, unreadCount, markAsRead } = useNotifications(
    15000,
    partnerURL,
  );

  const abbreviatedName = userInfo?.user_name
    .split(" ")
    .map((value) => value.charAt(0).toUpperCase())
    .join("");

  const [profileOptionsToggle, setProfileOptionsToggle] = useState(false);

  // Sidebar menu items
  const menuItems = [
    {
      label: "Dashboard",
      icon: <FaPeopleGroup size={20} />,
      path: "/partner",
    },
    {
      label: "Reports",
      icon: <FaChartBar className="w-5 h-5" />,
      submenu: [
        { label: "Clients", path: "/partner/report" },
        { label: "Client Accounts", path: "/partner/report/client" },
        { label: "Reward History", path: "/partner/report/rewards" },
        { label: "Client Transactions", path: "/partner/report/transctions" },
      ],
    },
    {
      label: "Rebates",
      icon: <FaPercent className="w-5 h-4" />,
      path: "/partner/rebates",
    },
    {
      label: "CRM Dashboard",
      icon: <MdOutlineDashboard className="w-5 h-5" />,
      path: "/dashboard",
    },
    {
      label: "Support",
      icon: <FaHeadset className="w-5 h-5" />,
      submenu: [{ label: "Contact", path: "/partner/support" }],
    },
  ];

  const handleExpand = (label) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  // Partner Mobile Sidebar
  const PartnerMobileSidebar = () => (
    <div
      className={`fixed inset-0 z-40 transition duration-300 ${
        sidebarOpen ? "block" : "hidden"
      }`}
      style={{ background: "rgba(0,0,0,0.3)" }}
      onClick={() => setSidebarOpen(false)}
    >
      <div
        className={`fixed left-0 top-0 h-full w-65 bg-[#0c1333] text-white shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } z-30`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-[#3a2566]">
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-2xl focus:outline-none"
          >
            &times;
          </button>
          {/* <BsGlobe className="w-6 h-6" /> */}
        </div>
        <div className="space-y-1 !text-white text-start px-6 mt-4">
          <div>
            <div
              className="flex flex-row items-center justify-between gap-2  text-white"
              onClick={() => setProfileOptionsToggle((prev) => !prev)}
            >
              <div className="">
                <span className="w-10 h-10 bg-blue-500 text-white font-bold flex items-center justify-center rounded-lg">
                  {abbreviatedName || (
                    <img
                      src={userImg}
                      alt="Avatar"
                      className="w-12 h-12 rounded-lg"
                    />
                  )}
                </span>
              </div>
              <div className="text-start text-md">
                <div className="text-start text-md">
                  <p>{userInfo?.user_name || "JD"}</p>
                </div>
              </div>
              <div>
                <MdKeyboardArrowDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    profileOptionsToggle ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {/* Menu */}
            {profileOptionsToggle && (
              <div className="text-white">
                {/* Sign Out */}
                <div
                  onClick={handleLogOut}
                  className="flex items-center gap-2 mt-5 mb-3"
                >
                  <FaSignOutAlt className="w-5 h-5" />
                  <span className="text-md font-semibold truncate">
                    Sign Out
                  </span>
                </div>
                <hr className="bg-black my-2" />
              </div>
            )}
          </div>
          <div
            className="flex items-center justify-between text-white"
            onClick={() => setHideBalance(!HideBalance)}
          >
            <div className="flex items-center gap-2 mt-6">
              <LuWallet className="w-5 h-5 " />
              <div className="flex flex-col">
                <span
                  className={`text-md font-semibold truncate ${
                    HideBalance && "blur-sm"
                  }`}
                >
                  {balanceData?.balance} USD
                </span>
              </div>
            </div>
            <button className="ml-2 focus:outline-none mt-6">
              {HideBalance ? (
                <FaRegEyeSlash className="w-5 h-5" />
              ) : (
                <FaRegEye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        <nav className="mt-4 flex flex-col gap-2">
          {menuItems.map((item) => (
            <div key={item.label}>
              {item.submenu ? (
                <>
                  <button
                    className="flex items-center w-full px-6 py-3 gap-3  hover:text-[#e08a09] focus:outline-none"
                    onClick={() => handleExpand(item.label)}
                  >
                    {item.icon}
                    <span className="flex-1 text-left text-md font-semibold truncate ">
                      {item.label}
                    </span>
                    <MdKeyboardArrowDown
                      className={`w-5 h-5 transition-transform duration-300 ${
                        expanded[item.label] ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`ml-10 flex flex-col gap-1 transition-all duration-300 origin-top
                        ${
                          expanded[item.label]
                            ? "opacity-100 scale-y-100 max-h-96"
                            : "opacity-0 scale-y-0 max-h-0 pointer-events-none"
                        }
                                        `}
                    style={{
                      transitionProperty: "opacity, transform, max-height",
                    }}
                  >
                    {item.submenu.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className="block px-2 py-2 text-md font-semibold hover:bg-[#4a357a] rounded"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="mx-2">{sub.label}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  to={item.path}
                  className="flex items-center px-6 py-3 gap-3 hover:bg-[#3a2566] rounded"
                  onClick={() => setSidebarOpen(false)}
                >
                  {item.icon}
                  <span className="text-md font-semibold truncate ">
                    {item.label}
                  </span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="md:hidden">
          <PartnerMobileSidebar />
        </div>
      )}
      {/* top header */}
      <header className="w-full fixed top-0 left-0 z-50 bg-[#0c1333] shadow-sm">
        <div className="max-w-full mx-2 px-1 sm:px-2 lg:px-3">
          <div className="flex justify-between items-center h-16">
            {/* menu */}
            <div className="block md:hidden">
              {sidebarOpen ? (
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 rounded border-2 border-transparent 
                  hover:border-blue-500 focus:outline-none 
                  focus:ring-0 focus:border-transparent 
                  active:border-transparent"
                >
                  <IoCloseSharp className="w-6 h-6 text-white" />
                </button>
              ) : (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-1 rounded border-2 border-transparent 
                  hover:border-blue-500 focus:outline-none 
                  focus:ring-0 focus:border-transparent 
                  active:border-transparent"
                >
                  <IoMenu className="w-6 h-6 text-white" />
                </button>
              )}
            </div>

            {/* Logo */}
            <div className="flex justify-center md:justify-start w-full">
              <h1 className="text-xl text-white font-bold tracking-wider text-center md:text-left">
                <Link to="/partner">
                  <img
                    src={partnerLogo}
                    alt="Logo"
                    className="text-white font-light"
                    style={{ maxWidth: "255px" }}
                  />
                </Link>
              </h1>
            </div>

            {/* Right Section options icon */}
            <div className="space-x-3 sm:flex items-center hidden  ">
              {/* Notifications */}
              <div className="flex justify-end items-center gap-4">
                <DropdownWrapperNotification
                  trigger={
                    <div className="relative cursor-pointer">
                      <FaRegBell className="w-6 h-6 text-white" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-[2px]">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  }
                  notifications={notifications}
                  markAsRead={markAsRead}
                  onSeeMore={() => setDrawerOpen(true)}
                />

                <NotificationDrawer
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  notifications={notifications}
                  markAsRead={markAsRead}
                />
              </div>
              {/* wallet */}
              <DropdownWrapperPartner
                trigger={
                  <div
                    className={`flex items-center gap-1 ${
                      HideBalance && "blur-sm"
                    }`}
                  >
                    <LuWallet className="w-6 h-6" />
                    {balanceData?.creditbal}{" "}
                    <span className="text-md">USD</span>
                  </div>
                }
              >
                <div className={`w-[280px]`}>
                  {/* Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          value={HideBalance}
                          onClick={() => setHideBalance(!HideBalance)}
                          className="sr-only peer"
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium">
                          Hide Balance
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Trading Account */}
                  <div
                    className={`p-4 border-b border-gray-100 ${
                      HideBalance && "blur-sm"
                    }`}
                  >
                    <div>
                      <div className="text-md text-start text-gray-700">
                        Account Balance
                      </div>
                      <div className="text-lg text-start font-semibold text-gray-900">
                        {balanceData?.creditbal} USD
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-4"></div>
                </div>
              </DropdownWrapperPartner>
              {/* User Dropdown */}
              <DropdownWrapperPartner
                trigger={<CgProfile className="w-5 h-5" />}
              >
                <div className="w-64">
                  {/* User Info */}
                  <div className="w-full flex flex-row p-2 items-center gap-4">
                    <div className="flex justify-center">
                      <CgProfile className="w-6 h-6" />
                    </div>
                    <div className="text-start text-sm">
                      <p>{userInfo?.user_name || ""}</p>
                      <span>{maskEmail(userInfo?.user_reg_code)}</span>
                    </div>
                  </div>
                  <hr className="bg-black my-2" />

                  <div className="space-y-1 text-start">
                    <div className="flex items-center hover:bg-gray-100 px-2 py-1 rounded cursor-pointer">
                      <MdDashboard className="w-5 h-5 mr-3" />
                      <Link to="/dashboard">
                        <button>CRM Dashboard</button>
                      </Link>
                    </div>
                  </div>
                  <hr className="bg-black my-2" />
                  {/* Sign Out partner*/}
                  <div
                    onClick={() => handleLogOut()}
                    className="flex items-center hover:bg-gray-100 px-2 py-1 rounded cursor-pointer"
                  >
                    <FaSignOutAlt className="w-5 h-5 mr-3" />
                    <span>Sign Out</span>
                  </div>
                </div>
              </DropdownWrapperPartner>
            </div>
            {/* mobile notification */}
            <div className="block md:hidden">
              <div className="flex justify-end items-center gap-4">
                <DropdownWrapperNotification
                  trigger={
                    <div className="relative cursor-pointer">
                      <FaRegBell className="w-6 h-6 text-white" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 min-w-4 flex items-center justify-center px-[2px]">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </div>
                  }
                  notifications={notifications}
                  markAsRead={markAsRead}
                  onSeeMore={() => setDrawerOpen(true)}
                />

                <NotificationDrawer
                  open={drawerOpen}
                  onClose={() => setDrawerOpen(false)}
                  notifications={notifications}
                  markAsRead={markAsRead}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
