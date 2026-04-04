import { useState } from "react";
import Logo from "../../assets/img/Logo.png";
import { Link } from "react-router-dom";
import { useSidebar } from "../../context/SidebarContext";
import DropdownWrapper from "../ui/DropdownWrapper";
import DropdownWrapperNotification from "../ui/DropdownWrapperNotification";
import NotificationDrawer from "../ui/NotificationDrawer";
import { PiSignOutBold } from "react-icons/pi";
import { RiLockPasswordLine } from "react-icons/ri";
// icon
import { BsGlobe } from "react-icons/bs";
import { LuWallet } from "react-icons/lu";
import { MdQuestionMark } from "react-icons/md";
import {
  FaRegBell,
  FaUserFriends,
  FaRegEyeSlash,
  FaRegEye,
} from "react-icons/fa";
import { HiOutlineDocumentSearch } from "react-icons/hi";
import { CgProfile, CgMenuGridO } from "react-icons/cg";
import { IoMenu } from "react-icons/io5";
import { IoCloseSharp } from "react-icons/io5";
import { MdOutlineDashboard, MdOutlineCandlestickChart } from "react-icons/md";
import useLogoutHandler from "../../hooks/useLogout";
import useNotifications from "../../hooks/useNotifications";
import { USER_NOTIFICATION } from "../../utils/constants";

export const Header = ({ user, balanceData, setHideBalance, HideBalance }) => {
  const { toggle, setToggle, isMobile } = useSidebar();
  const { handleLogOut } = useLogoutHandler();
  const [hideEmail, setHideEmail] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dasboardURL = `${USER_NOTIFICATION.GET_NOTIFICATION}`;

  const { notifications, unreadCount, markAsRead } = useNotifications(
    15000,
    dasboardURL,
  );

  return (
    <>
      {/* header */}
      <header className="w-full h-16 md:h-20  fixed top-0 left-0 bg-[#0c1333] shadow-sm flex items-center justify-between px-4 z-40">
        {/* menu */}
        <div className="block md:hidden px-2 py-1 text-sm font-medium cursor-pointer transition-all ">
          {isMobile &&
            (toggle ? (
              <div>
                <IoCloseSharp
                  onClick={() => setToggle(!toggle)}
                  className="w-6 h-6 font-mono text-white"
                />
              </div>
            ) : (
              <button onClick={() => setToggle(!toggle)}>
                <IoMenu className="w-7 h-7 text-white" />
              </button>
            ))}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2  justify-between py-3 px-1">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img
              src={Logo}
              alt="Logo"
              className="h-full w-auto object-contain"
              style={{ maxWidth: "180px" }}
            />
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="md:flex items-center hidden">
          {/* wallet */}
          <DropdownWrapper
            trigger={
              <div className={`flex items-center gap-1`}>
                <LuWallet className="w-6 h-6" />
                <span className={` text-md ${HideBalance && "blur-sm"}`}>
                  {balanceData?.creditbal} USD
                </span>
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
                className={`p-4 border-gray-100 ${HideBalance && "blur-sm"}`}
              >
                <div className="text-md text-start text-gray-800 mb-1">
                  Account Balance
                </div>
                <div className="text-lg text-start font-semibold text-gray-900">
                  {balanceData?.creditbal} USD
                </div>
              </div>
            </div>
          </DropdownWrapper>

          {/* Language Selector */}
          <DropdownWrapper
            trigger={
              <div>
                <BsGlobe className="w-6 h-6" />
              </div>
            }
          >
            <div className="w-40">
              <ul className="text-sm text-gray-700">
                <li className="hover:bg-gray-100 p-2 rounded">English</li>
              </ul>
            </div>
          </DropdownWrapper>

          {/* Tools & services and Help */}
          <DropdownWrapper trigger={<MdQuestionMark className="w-6 h-6" />}>
            <div className="w-[200px] text-sm">
              <div className="grid grid-cols-1 p-2">
                {/* Left Column - Tools & Services */}
                <div className="text-start">
                  <p className="font-semibold text-gray-600 mb-2 text-xs uppercase tracking-wide">
                    Tools & Services
                  </p>
                  <ul className="space-y-2">
                    <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                      <Link
                        to={"https://novotrend.co/platforms/index.php"}
                        target="_blank"
                      >
                        MetaTrader5
                      </Link>
                    </li>
                    <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                      <Link
                        to={"https://webtrading.novotrend.co"}
                        target="_blank"
                      >
                        WebTerminal
                      </Link>
                    </li>

                    <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                      <Link
                        to={"https://member.novotrend.co/treadingtools/economy"}
                        target="_blank"
                      >
                        Economic Calendar
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Right Column - Trading + Help */}
                <div className="hidden flex-col">
                  {/* Trading Section */}
                  <div className="mb-6 text-start">
                    <p className="font-semibold text-gray-600 mb-2 text-xs uppercase tracking-wide">
                      Trading
                    </p>
                    <ul className="">
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Contract Specifications
                      </li>
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Margin & Leverage
                      </li>
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Forex Market Trading Hours
                      </li>
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Dividends on Indices
                      </li>
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Deposit And Withdrawals
                      </li>
                    </ul>
                  </div>

                  {/* Help Section */}
                  <div className="text-start">
                    <p className="font-semibold text-gray-600 mb-2 text-xs uppercase tracking-wide">
                      Help
                    </p>
                    <ul className="">
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Exness Help Center
                      </li>
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        How to Become Our Partner
                      </li>
                      <li className="text-gray-700 hover:text-blue-600 cursor-pointer py-1 px-2 rounded hover:bg-blue-50 transition-all duration-200">
                        Suggest a feature
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </DropdownWrapper>

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

          {/* App Grid */}
          <DropdownWrapper
            trigger={
              <div>
                <CgMenuGridO className="w-6 h-6" />
              </div>
            }
          >
            <div className="text-sm w-64">
              <ul>
                <li className="px-4 py-2 hover:bg-gray-100 rounded-md transform duration-100 ease-in">
                  <Link to={"/"} target="" className="flex items-center gap-2">
                    <MdOutlineDashboard className="w-[18px] h-[18px]" />{" "}
                    Personal Area
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 rounded-md transform duration-100 ease-in">
                  <Link
                    to={"https://webtrading.novotrend.co"}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <MdOutlineCandlestickChart className="w-[18px] h-[18px]" />{" "}
                    Novo Terminal
                  </Link>
                </li>
                <li className="px-4 py-2 hover:bg-gray-100 rounded-md transform duration-100 ease-in">
                  <Link
                    to={"https://novotrend.co"}
                    target="_blank"
                    className="flex items-center gap-2"
                  >
                    <span className="text-sm font-semibold">NV</span> Public
                    website
                  </Link>
                </li>
                {Number(balanceData?.user_activated_for_ib) === 1 && (
                  <li className="px-4 py-2 hover:bg-gray-100 rounded-md transform duration-100 ease-in">
                    <Link
                      to={"/partner"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2"
                    >
                      <FaUserFriends className="w-[18px] h-[18px]" /> Partner
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </DropdownWrapper>

          {/* User Dropdown */}
          <DropdownWrapper
            trigger={
              <div className="text-md font-semibold flex bg-white text-black rounded-3xl p-2">
                {user?.firstname?.trim().toUpperCase()[0] +
                  user?.lastname?.trim().toUpperCase()[0] || "JD"}
              </div>
            }
          >
            <div className="w-64">
              {/* User Info */}
              <div className="w-full flex justify-between flex-row p-2 items-center">
                <div className="text-start font-semibold text-md">
                  <p>
                    {user?.firstname?.trim() + " " + user?.lastname?.trim()}
                  </p>
                  <span className={`${hideEmail && "blur-sm"}`}>
                    {user?.user_reg_code}
                  </span>
                </div>
                <div>
                  <button
                    className="ml-2 focus:outline-none mt-6"
                    onClick={() => setHideEmail(!hideEmail)}
                  >
                    {hideEmail ? (
                      <FaRegEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaRegEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
              <hr className="bg-black my-2" />
              {/* Menu */}
              <div className="space-y-1 text-start">
                <div className="flex gap-2 items-center hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">
                  <CgProfile className="w-5 h-5 stroke-[0.3]" />
                  <Link to={"/settings"}>
                    <span className="text-md font-medium truncate">
                      User Profile
                    </span>
                  </Link>
                </div>
              </div>
              <div className="space-y-1 text-start">
                <div className="flex gap-2 items-center hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">
                  <HiOutlineDocumentSearch className="stroke-[2.5] w-5 h-5" />
                  <Link to={"/settings/documents"}>
                    <span className="text-md font-medium">Documents</span>
                  </Link>
                </div>
              </div>
              <div className="space-y-1 text-start">
                <div className="flex gap-2 items-center hover:bg-gray-200 px-2 py-1 rounded cursor-pointer">
                  <RiLockPasswordLine className="stroke-[0.5] w-5 h-5" />
                  <Link to={"/settings/password"}>
                    <span className="text-md font-medium">Password</span>
                  </Link>
                </div>
              </div>
              <hr className="bg-black my-2" />
              {/* Sign Out */}
              <div
                onClick={handleLogOut}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-200 cursor-pointer"
              >
                <PiSignOutBold className="stroke-[0.5] w-5 h-5" />
                <span className="text-md font-medium ">Sign Out</span>
              </div>
            </div>
          </DropdownWrapper>
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
      </header>
      {isMobile && toggle && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => isMobile && setToggle(false)} // Only close on mobile
        />
      )}
    </>
  );
};
