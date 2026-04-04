import { Link } from "react-router-dom";
import BankIcon from "../assets/Icons/BankIcon.svg";
import CashIcon from "../assets/Icons/CashIcon.svg";
// import BetweenIcon from "../assets/Icons/BetweenIcon.svg";
import BNB from "../assets/Icons/BNB.svg";
import Trc from "../assets/Icons/Tether.svg";
import Eth from "../assets/Icons/ETH.svg";
import Matic from "../assets/Icons/Matic.svg";
import { useSidebar } from "../context/SidebarContext";

export const Withdraw = () => {
  const { toggle, setToggle, isMobile } = useSidebar();

  const firstMethods = [
    {
      title: "Binance Pay",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: BNB,
      link: "/funds/withdraw/WithdrawWith",
    },
    {
      title: "Neteller",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: Trc,
      link: "/funds/withdraw/WithdrawWith",
    },
    {
      title: "SticPay",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: Eth,
      link: "/funds/withdraw/WithdrawWith",
    },
    {
      title: "Skrill",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: Matic,
      link: "/funds/withdraw/WithdrawWith",
    },
  ];

  const SecondMethods = [
    // {
    //   title: "Between your account",
    //   time: "Instant (30 mins)",
    //   fee: "0%",
    //   limits: "$10 - $1,000",
    //   icon: BetweenIcon,
    //   link: "/funds/transfer-between-account",
    // },
    {
      title: "Bank Transfer",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: BankIcon,
      link: "/funds/withdraw/Withdraw-bank-transfer",
    },
    {
      title: "Cash",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: CashIcon,
      link: "/funds/withdraw/Withdraw-cash",
    },
  ];

  const WalletMethods = [
    {
      title: "USDT - BEP20",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: BNB,
      link: "/funds/withdraw/bsc",
    },
    {
      title: "USDT - TRC20",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: Trc,
      link: "/funds/withdraw/tron",
    },
    {
      title: "USDT - ETH20",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: Eth,
      link: "/funds/withdraw/eth",
    },
    {
      title: "USDT - MATIC20",
      time: "Instant (30 mins)",
      fee: "0%",
      limits: "$10 - $1,000",
      icon: Matic,
      link: "/funds/withdraw/polygon",
    },
  ];

  return (
    <>
      <section
        className={`transition-all duration-300`}
        onClick={() => {
          if (isMobile && toggle) {
            setToggle(false);
          }
        }}
      >
        <div className="rounded-lg text-start md:min-h-[83vh] max-w-6xl">
          {/* Header Section */}
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900">Withdraw</h2>
            <span className="text-gray-500 font-normal text-base">
              Withdraw your funds from following methods
            </span>
          </div>

          {/* Main Withdraw Methods Section */}
          <div className="mb-6">
            <div className="flex gap-4 p-2 flex-wrap lg:flex-nowrap">
              {SecondMethods.map((option, index) => (
                <div
                  key={index}
                  className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-lg transition-shadow lg:w-1/2 text-start w-full"
                >
                  <Link to={option.link}>
                    <div className="flex items-center gap-4">
                      <img src={option.icon} alt="" />
                      <h3 className="font-semibold text-lg">{option.title}</h3>
                    </div>
                    <p className="mt-2 text-sm text-gray-600">
                      <span className="font-semibold">Processing time:</span>{" "}
                      {option.time}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Fees:</span> {option.fee}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Limits:</span>{" "}
                      {option.limits}
                    </p>
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Crypto Wallets Section */}
          <div className="mb-6">
            <div className="flex flex-col mb-3 items-start gap-1">
              <h2 className="text-3xl font-bold text-gray-900">
                Crypto Wallets
              </h2>
              <span className="text-gray-500 font-normal text-base">
                Withdraw your funds from Crypto Currency
              </span>
            </div>
            <div className="flex py-4 flex-wrap">
              {WalletMethods.map((option, index) => (
                <div className="w-full sm:w-1/2 lg:w-1/2 p-2" key={index}>
                  <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-lg transition-shadow text-start">
                    <Link to={`${option.link}`}>
                      <div className="flex items-center gap-4">
                        <img src={option.icon} alt="" />
                        <h3 className="font-semibold text-lg">
                          {option.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Processing time:</span>{" "}
                        {option.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Fees:</span>{" "}
                        {option.fee}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Limits:</span>{" "}
                        {option.limits}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div>
            <div className="flex flex-col mb-0 items-start">
              <h2 className="text-3xl font-bold text-gray-900">Coming Soon</h2>
              <span className="text-gray-500 font-normal text-base"></span>
            </div>
            <div className="flex py-4 flex-wrap">
              {firstMethods.map((option, index) => (
                <div className="w-full sm:w-1/2 lg:w-1/2 p-2" key={index}>
                  <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-lg transition-shadow text-start">
                    <Link>
                      <div className="flex items-center gap-4">
                        <img src={option.icon} alt="" />
                        <h3 className="font-semibold text-lg">
                          {option.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-600">
                        <span className="font-semibold">Processing time:</span>{" "}
                        {option.time}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Fees:</span>{" "}
                        {option.fee}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Limits:</span>{" "}
                        {option.limits}
                      </p>
                    </Link>
                    <h6 className="text-xs text-center mt-2">Coming soon</h6>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
