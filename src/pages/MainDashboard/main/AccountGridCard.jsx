import { Link } from "react-router-dom";
import { FiTrendingUp } from "react-icons/fi";
import { FaRegArrowAltCircleDown, FaRegArrowAltCircleUp } from "react-icons/fa";
import { SlOptionsVertical } from "react-icons/sl";
import DropdownCustomOpen from "../../../components/Common/DropdownCustomOpen";

const AccountGridCard = ({
  account,
  openDropdownId,
  setOpenDropdownId,
  openChangePasswordPopup,
}) => {

  return (
    <div
      className="border border-gray-200 rounded-lg bg-white hover:shadow-lg transition-shadow"
    >
      {/* Account Header */}
      <div className="px-3 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                account.type === "real"
                  ? "bg-green-100 text-green-800"
                  : account.type === "demo"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
            </span>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {account.nickname}
            </span>
          </div>
          <DropdownCustomOpen
            open={openDropdownId === account.id}
            onOpenChange={(isOpen) => setOpenDropdownId(isOpen ? account.id : null)}
            trigger={<SlOptionsVertical className="w-4 h-4 text-black" />}
          >
            <div className="w-60">
              <div className="w-full flex pb-4 px-4 pt-2">
                <div className="w-1/3 text-xs flex items-center flex-col gap-1">
                  <a
                    href="https://webtrading.novotrend.co/terminal"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-500 text-white transform duration-200 flex justify-center items-center rounded-full py-2 px-2"
                  >
                    <FiTrendingUp className="w-5 h-5" />
                  </a>
                  Trade
                </div>
                <div className="w-1/3 text-xs flex items-center flex-col gap-1">
                  <Link
                    to={"/funds/"}
                    className="hover:bg-blue-500 hover:text-white transform duration-200 bg-gray-100 flex justify-center items-center rounded-full py-2 px-2"
                  >
                    <FaRegArrowAltCircleDown className="w-5 h-5" />
                  </Link>
                  Deposit
                </div>
                <div className="w-1/3 text-xs flex items-center flex-col gap-1">
                  <Link
                    to={"/funds/withdraw"}
                    className="hover:bg-blue-500 hover:text-white transform duration-200 bg-gray-100 flex justify-center items-center rounded-full py-2 px-2"
                  >
                    <FaRegArrowAltCircleUp className="w-5 h-5" />
                  </Link>
                  Withdraw
                </div>
              </div>
              <hr className="bg-black w-full" />
              <div className="text-start mt-2">
                <ul className="text-sm flex flex-col">
                  <li className="px-4 py-2">
                    <button
                      onClick={() => {
                        openChangePasswordPopup(account);
                        setOpenDropdownId(null); // Close dropdown on popup open
                      }}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors mt-2 sm:mt-0"
                    >
                      Change Trading Password
                    </button>
                  </li>
                  <li className="px-4 py-2">
                    <button
                      onClick={() => {
                        openChangePasswordPopup(account, "nickName");
                        setOpenDropdownId(null); // Close dropdown on popup open
                      }}
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors mt-2 sm:mt-0"
                    >
                      Update Nick Name
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </DropdownCustomOpen>
        </div>
      </div>
      {/* Account Details */}
      <div className="px-5 py-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Number</span>
            <span className="text-gray-900 text-sm font-medium">
              #{account.number}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Nick Name</span>
            <span className="text-gray-900 text-sm font-medium">
              {account.nickname}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Platform</span>
            <span className="text-gray-900 text-sm font-medium">
              {account.platform}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Type</span>
            <span className="text-gray-900 text-sm font-medium">
              {account.subtype}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Server</span>
            <span className="text-gray-900 text-sm font-medium">
              {"Novotrend Ltd"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Free Margin</span>
            <span className="text-gray-900 text-sm font-medium">
              {account.freeMargin} {account.currency}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Actual Leverage</span>
            <span className="text-gray-900 text-sm font-medium">
              {account.actualLeverage}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Max Leverage</span>
            <span className="text-gray-900 text-sm font-medium">
              {account.maxLeverage}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountGridCard;