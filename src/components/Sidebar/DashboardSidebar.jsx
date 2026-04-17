import { useState } from "react";
import PropTypes from "prop-types";
import {
  FiHome,
  FiBarChart2,
  FiClock,
  FiTool,
  FiUser,
  FiSettings,
  FiChevronDown,
  FiDollarSign,
  FiUserPlus,
} from "react-icons/fi";
import {
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdOutlineLibraryBooks,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import {
  FaSignOutAlt,
  FaRegEye,
  FaRegEyeSlash,
  FaUserFriends,
} from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import { LuNewspaper } from "react-icons/lu";
import { useSidebar } from "../../context/SidebarContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { maskEmail } from "../../utils/makingEmail";
import { LuWallet } from "react-icons/lu";
import { CgMenuGridO } from "react-icons/cg";
// import { MdCampaign } from "react-icons/md";
import useLogoutHandler from "../../hooks/useLogout";
import BecomePartnerModal from "../Models/BecomePartnerModel";
import { toast } from "react-toastify";
import { useUserContext } from "../../context/useUserContext";

export default function DashboardSidebar({
  user = {},
  balanceData,
  HideBalance,
  setHideBalance,
}) {
  const { toastOptions } = useUserContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOptionsToggle, setProfileOptionsToggle] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const { toggle, setToggle, isMobile } = useSidebar();
  const { handleLogOut } = useLogoutHandler();

  // const handleMenuClick = (path) => {
  //   if (path === "partner") {
  //     setShowPartnerModal(true);
  //     return;
  //   }

  //   navigate(path);
  //   if (isMobile) {
  //     setToggle(false);
  //   } else if (!toggle) {
  //     setToggle(true);
  //   }
  // };

  const handleMenuClick = (path) => {
    if (balanceData?.ib_reject_by_admin === 2 && path === "partner") {
      toast.info(
        "Become a Partner is pending for Approval from Admin",
        toastOptions,
      );
      return; // stop modal
    }

    if (path === "partner") {
      setShowPartnerModal(true);
      return;
    }

    navigate(path);

    if (isMobile) {
      setToggle(false);
    } else if (!toggle) {
      setToggle(true);
    }
  };

  // menu items
  const menuArray = [
    {
      id: "dashboard",
      txt: "Dashboard",
      MenuPath: "/dashboard",
      icon: <FiHome size={20} />,
      onClick: handleMenuClick,
    },
    {
      id: "accounts",
      txt: "Accounts",
      MenuPath: "/account",
      icon: <FiUser size={20} />,
      onClick: handleMenuClick,
    },
    {
      id: "funds",
      txt: "Funds",
      MenuPath: "/funds",
      icon: <FiDollarSign size={20} />,
      iconArr: <FiChevronDown size={20} />,
      submenu: [
        {
          id: "deposite",
          txt: "Deposit",
          MenuPath: "/funds",
          onClick: handleMenuClick,
        },
        {
          id: "withdraw",
          txt: "Withdraw",
          MenuPath: "/funds/withdraw",
          onClick: handleMenuClick,
        },
        {
          id: "updateBank",
          txt: "Add Bank Account",
          MenuPath: "/funds/add-bank-account",
          onClick: handleMenuClick,
        },
        {
          id: "transferbank",
          txt: "Transfer Between Account",
          MenuPath: "/funds/transfer-between-account",
          onClick: handleMenuClick,
        },
        {
          id: "mt5Towallet",
          txt: "MT5 to Wallet",
          MenuPath: "/funds/mt5-to-wallet",
          onClick: handleMenuClick,
        },
        {
          id: "wallettomt5",
          txt: "Wallet to MT5",
          MenuPath: "/funds/wallet-to-mt5",
          onClick: handleMenuClick,
        },
      ],
    },
    {
      id: "transaction history",
      txt: "Transaction History",
      MenuPath: "/transaction-history",
      icon: <FiClock size={20} />,
      onClick: handleMenuClick,
    },
    {
      id: "tradinghistory",
      txt: "Trading History",
      MenuPath: "/Trading-History/",
      icon: <FiBarChart2 size={20} />,
      onClick: handleMenuClick,
    },
    {
      id: "Socialtrading",
      txt: "Social Trading",
      MenuPath: "https://socialtrading.novotrend.co:8085/portal/",
      icon: <MdOutlineLibraryBooks size={20} />,
      external: true,
    },
    {
      id: "tools",
      txt: "Trading Platforms",
      MenuPath: "/tools",
      icon: <FiTool size={20} />,
      onClick: handleMenuClick,
    },
    {
      id: "tradingtools",
      txt: "Trading Tools",
      MenuPath: "/analytics",
      icon: <LuNewspaper size={20} />,
      iconArr: <FiChevronDown size={20} />,
      submenu: [
        {
          id: "analystview",
          txt: "Analyst Views",
          MenuPath: "/treadingtools",
          onClick: handleMenuClick,
        },
        {
          id: "marketnews",
          txt: "Market News",
          MenuPath: "/treadingtools/market",
          onClick: handleMenuClick,
        },
        {
          id: "economiccalender",
          txt: "Economic Calendar",
          MenuPath: "/treadingtools/economy",
          external: true,
        },
      ],
    },
    // future requirment
    // {
    //   id: "promotion",
    //   txt: "Promotion",
    //   MenuPath: "/offers",
    //   icon: <MdCampaign size={25} />,
    //   iconArr: <FiChevronDown size={20} />,
    //   submenu: [
    //     {
    //       id: "claimbonus",
    //       txt: "Claim Bonus",
    //       MenuPath: "/claimbonus",
    //       onClick: handleMenuClick,
    //     },
    //     {
    //       id: "offers",
    //       txt: "Offers",
    //       MenuPath: "/offers",
    //       onClick: handleMenuClick,
    //     },
    //   ],
    // },
    {
      id: "support",
      txt: "Support",
      MenuPath: "/support",
      icon: <FiUserPlus size={20} />,
      onClick: handleMenuClick,
    },
    {
      id: "profiles",
      txt: "Profile",
      MenuPath: "/settings",
      icon: <FiSettings size={20} />,
      iconArr: <FiChevronDown size={20} />,
      submenu: [
        {
          id: "personals",
          txt: "Personal",
          MenuPath: "/settings",
          onClick: handleMenuClick,
        },
        {
          id: "docs",
          txt: "Documents",
          MenuPath: "/settings/documents",
          onClick: handleMenuClick,
        },
        {
          id: "passwords",
          txt: "Password",
          MenuPath: "/settings/password",
          onClick: handleMenuClick,
        },
      ],
    },
    // Become IB
    // eslint-disable-next-line eqeqeq
    ...(balanceData?.user_activated_for_ib == 0
      ? [
          {
            id: "become a partner",
            txt: "Become A Partner",
            icon: <FaUserFriends size={20} />,
            onClick: () => handleMenuClick("partner"),
          },
        ]
      : []),
  ];

  const AppArray = [
    {
      id: "products",
      txt: "Products",
      icon: <CgMenuGridO size={20} />,
      iconArr: <FiChevronDown size={20} />,
      submenu: [
        {
          id: "novo-terminal",
          txt: "Novo Terminal",
          MenuPath: "https://webtrading.novotrend.co",
          external: true,
        },
        {
          id: "public-website",
          txt: "Public website",
          MenuPath: "https://novotrend.co",
          external: true,
        },
      ],
    },
    {
      id: "partner",
      txt: "Partner",
      MenuPath: "/partner",
      onClick: handleMenuClick,
      icon: <FaPeopleGroup size={20} />,
    },
  ];

  // Fallbacks for user fields
  const userImg = user?.user_img || "https://ui-avatars.com/api/?name=User";
  const userFirstName = (user?.firstname || "User").trim();
  const userLastName = (user?.lastname || "").trim();
  const userEmail = user?.user_reg_code || "user@example.com";

  return (
    <>
      {showPartnerModal && (
        <BecomePartnerModal onClose={() => setShowPartnerModal(false)} />
      )}
      <aside
        className={`h-screen bg-[#0c1333] border-r shadow-lg fixed left-0 flex flex-col justify-between transition-all duration-300 z-30 overflow-x-hidden
            ${toggle ? "w-64" : isMobile ? "w-0" : "w-20"} ${
              isMobile ? (toggle ? "translate-x-0" : "-translate-x-full") : ""
            }
        `}
      >
        <div
          className={`flex-1 overflow-y ${
            isMobile && !toggle ? "hidden" : "flex flex-col"
          }`}
        >
          {/* CHANGED: Text now changes based on toggle state to prevent overflow */}
          <div className="my-5 md:my-6 text-white text-center text-xl font-bold">
            {toggle ? "Novotrend" : "N"}
          </div>

          {/* User Info */}
          {isMobile && (
            <div className="">
              <div
                className="w-full flex flex-row items-center justify-between gap-2 p-2 text-white"
                onClick={() => setProfileOptionsToggle((prev) => !prev)}
              >
                <div className="flex justify-center w-fit">
                  <img
                    src={userImg}
                    alt="Avatar"
                    className="rounded-lg h-12 w-12"
                  />
                </div>
                <div className="text-start text-sm">
                  <p>{userFirstName + " " + userLastName}</p>
                  <span>{maskEmail(userEmail)}</span>
                </div>
                <div className="mx-2">
                  {profileOptionsToggle ? (
                    <MdKeyboardArrowUp className="w-5 h-5" />
                  ) : (
                    <MdKeyboardArrowDown className="w-5 h-5" />
                  )}
                </div>
              </div>
              {/* Menu */}
              {profileOptionsToggle && (
                <div className="px-2 text-white">
                  {/* Sign Out Mobile Device */}
                  <div
                    onClick={handleLogOut}
                    className="flex items-center gap-2 p-3"
                  >
                    <FaSignOutAlt className="w-5 h-5 mr-3" />
                    <span className="text-md font-semibold truncate">
                      Sign Out
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          {isMobile && <hr className="bg-black" />}
          {/* wallet */}
          {isMobile && (
            <div className="px-2">
              <div
                className="flex items-center justify-between p-3 text-white"
                onClick={() => setHideBalance(!HideBalance)}
              >
                <div className="flex items-center gap-2">
                  <LuWallet className="w-5 h-5 mr-3" />
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
                <button className="ml-2 focus:outline-none">
                  {HideBalance ? (
                    <FaRegEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaRegEye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}
          {isMobile && <hr className="bg-black" />}
          {/* Navigation Links */}
          <nav className="flex-1">
            {menuArray.map((item) => {
              const isActive =
                location.pathname === item.MenuPath ||
                location.pathname.startsWith(item.MenuPath);

              // External link
              if (item.external) {
                return (
                  <div key={item.id} className="px-2">
                    <a
                      href={item.MenuPath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-3 rounded cursor-pointer
                      transition-all duration-300 ease-in-out transform
                      overflow-hidden whitespace-nowrap w-full
                      text-white hover:text-[#e08a09]
                    `}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`${toggle ? "mr-3" : "mx-auto"}`}>
                          {item.icon}
                        </span>
                        {toggle && (
                          <span className="text-md font-semibold truncate">
                            {item.txt}
                          </span>
                        )}
                      </div>
                    </a>
                  </div>
                );
              }

              // Internal link
              return (
                <div key={item.MenuPath} className="px-2">
                  <Link
                    to={item.MenuPath}
                    onClick={(e) => {
                      e.preventDefault();
                      if (!isMobile && !toggle) setToggle(true);
                      if (item.submenu) {
                        setOpenSubmenu(
                          openSubmenu === item.id ? null : item.id,
                        );
                      } else {
                        if (item.onClick) item.onClick(item.MenuPath);
                        setOpenSubmenu(null);
                        if (isMobile) setToggle(false);
                      }
                    }}
                    className={`flex items-center justify-between p-3 rounded cursor-pointer
                    transition-all duration-300 ease-in-out transform
                    overflow-hidden whitespace-nowrap w-full
                    text-white hover:text-[#e08a09]
                    ${isActive ? "scale-[0.98] text-[#e08a09]" : ""}
                  `}
                  >
                    {/* Left Side */}
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`${toggle ? "mr-3" : "mx-auto"}`}>
                        {item.icon}
                      </span>
                      {toggle && (
                        <span className="text-md font-semibold truncate">
                          {item.txt}
                        </span>
                      )}
                    </div>
                    {/* Right Side: iconArr */}
                    {toggle && item.iconArr && (
                      <span
                        className={`ml-auto shrink-0 transition-transform duration-300 ${
                          item.submenu && openSubmenu === item.id
                            ? "rotate-180"
                            : ""
                        }`}
                      >
                        {item.iconArr}
                      </span>
                    )}
                  </Link>
                  {/* Submenu Items - Animated dropdown */}
                  {item.submenu && (
                    <div
                      className={`
                      transition-all duration-300 ease-in-out
                      overflow-hidden text-start
                      ${toggle ? "ml-12" : "ml-2"}
                      ${
                        openSubmenu === item.id
                          ? "max-h-[500px] opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }
                    `}
                    >
                      {item.submenu.map((subItem) =>
                        subItem.external ? (
                          <a
                            key={subItem.MenuPath}
                            href={subItem.MenuPath}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center p-2 text-md font-semibold rounded
                            transition-all duration-300 ease-in-out
                            text-white hover:text-[#e08a09]`}
                          >
                            {toggle && <span>{subItem.txt}</span>}
                          </a>
                        ) : (
                          <Link
                            key={subItem.MenuPath}
                            to={subItem.MenuPath}
                            onClick={() => {
                              if (isMobile) setToggle(false);
                              if (subItem.onClick)
                                subItem.onClick(subItem.MenuPath);
                            }}
                            className={`flex items-center p-2 text-md font-semibold rounded
                            transition-all duration-300 ease-in-out
                            text-white hover:text-[#e08a09]`}
                          >
                            {toggle && <span>{subItem.txt}</span>}
                          </Link>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          {/* Bottom side */}
          {isMobile && (
            <nav className="flex-1">
              {AppArray.map((item) => {
                const isActive =
                  location.pathname === item.MenuPath ||
                  location.pathname.startsWith(item.MenuPath);

                // External link
                if (item.external) {
                  return (
                    <div key={item.MenuPath} className="px-2">
                      <a
                        href={item.MenuPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-between p-3 rounded cursor-pointer
                        transition-all duration-300 ease-in-out transform
                        overflow-hidden whitespace-nowrap w-full
                        text-white hover:text-[#e08a09]
                        `}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`${toggle ? "mr-3" : "mx-auto"}`}>
                            {item.icon}
                          </span>
                          {toggle && (
                            <span className="text-md font-semibold truncate">
                              {item.txt}
                            </span>
                          )}
                        </div>
                      </a>
                    </div>
                  );
                }

                // Internal link
                return (
                  <div key={item.MenuPath} className="px-2">
                    <Link
                      to={item.MenuPath}
                      onClick={(e) => {
                        e.preventDefault();
                        if (!isMobile && !toggle) setToggle(true);
                        if (item.submenu) {
                          setOpenSubmenu(
                            openSubmenu === item.id ? null : item.id,
                          );
                        } else {
                          if (item.onClick) item.onClick(item.MenuPath);
                          setOpenSubmenu(null);
                          if (isMobile) setToggle(false);
                        }
                      }}
                      className={`flex items-center justify-between p-3 rounded cursor-pointer
                      transition-all duration-300 ease-in-out transform
                      overflow-hidden whitespace-nowrap w-full
                      text-white hover:text-[#e08a09]
                    ${isActive ? "scale-[0.98] text-[#e08a09]" : ""}
                  `}
                    >
                      {/* Left Side */}
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`${toggle ? "mr-3" : "mx-auto"}`}>
                          {item.icon}
                        </span>
                        {toggle && (
                          <span className="text-md font-semibold truncate">
                            {item.txt}
                          </span>
                        )}
                      </div>
                      {/* Right Side: iconArr */}
                      {toggle && item.iconArr && (
                        <span
                          className={`ml-auto shrink-0 transition-transform duration-300 ${
                            item.submenu && openSubmenu === item.id
                              ? "rotate-180"
                              : ""
                          }`}
                        >
                          {item.iconArr}
                        </span>
                      )}
                    </Link>
                    {/* Submenu Items - Animated dropdown */}
                    {item.submenu && (
                      <div
                        className={`
                      transition-all duration-300 ease-in-out
                      overflow-hidden text-start
                      ${toggle ? "ml-12" : "ml-2"}
                      ${
                        openSubmenu === item.id
                          ? "max-h-[500px] opacity-100 translate-y-0"
                          : "max-h-0 opacity-0 -translate-y-2"
                      }
                    `}
                      >
                        {item.submenu.map((subItem) =>
                          subItem.external ? (
                            <a
                              key={subItem.MenuPath}
                              href={subItem.MenuPath}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`flex items-center p-2 text-md font-semibold rounded
                              transition-all duration-300 ease-in-out
                              text-white hover:text-[#e08a09]`}
                            >
                              {toggle && <span>{subItem.txt}</span>}
                            </a>
                          ) : (
                            <Link
                              key={subItem.MenuPath}
                              to={subItem.MenuPath}
                              onClick={() => {
                                if (isMobile) setToggle(false);
                                if (subItem.onClick)
                                  subItem.onClick(subItem.MenuPath);
                              }}
                              className={`flex items-center p-2 text-md font-semibold rounded
                              transition-all duration-300 ease-in-out
                              text-white hover:text-[#e08a09]`}
                            >
                              {toggle && <span>{subItem.txt}</span>}
                            </Link>
                          ),
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          )}
        </div>
        {/* Invite Box & Collapse Button */}
        <div className="px-2 pb-4 shrink-0">
          {isMobile ? null : (
            <div className="border-2 border-gray-100 hover:border-[#e08a09] rounded-lg">
              <button
                onClick={() => {
                  setOpenSubmenu(null);
                  setToggle(!toggle);
                }}
                className="w-full py-3 px-2 flex justify-center outline-none text-white hover:text-[#e08a09]"
              >
                {toggle ? (
                  <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
                ) : (
                  <MdKeyboardDoubleArrowRight className="w-5 h-5" />
                )}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

DashboardSidebar.propTypes = {
  user: PropTypes.shape({
    user_img: PropTypes.string,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    user_reg_code: PropTypes.string,
  }),
  balanceData: PropTypes.object,
  HideBalance: PropTypes.bool,
  setHideBalance: PropTypes.func,
};
