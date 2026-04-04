import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MarketNewsWidth from "../components/ui/MarketNewsWidth";
import TradingCardsMeter from "../components/ui/TradingCardsMeter";

const AnaliticViewData = {
  forex: [
    "OANDA:USDCHF",
    "OANDA:AUDUSD",
    "OANDA:USDCAD",
    "FX:GBPUSD",
    "OANDA:AUDJPY",
    "MARKETSCOM:USDJPY",
    "MARKETSCOM:EURUSD",
    "MARKETSCOM:EURGBP",
  ],
  crypto: [
    "OKX:BTCUSD",
    "MEXC:DOGEUSDT",
    "CRYPTO:ADAUSD",
    "BITSTAMP:XRPUSD",
    "CRYPTO:ETHUSD",
    "BINANCE:BNBUSD",
    "KRAKEN:USDJPY",
    "KRAKEN:EURUSD",
    "OANDA:AUDJPY",
    "KRAKEN:EURGBP",
  ],
  stocks: [
    "NASDAQ:AMZN",
    "NASDAQ:TSLA",
    "NASDAQ:GOOGL",
    "NASDAQ:META",
    "NASDAQ:AAPL",
    "NASDAQ:NVDA",
    "NASDAQ:MSFT",
    "NYSE:XOM",
  ],
  indices: [
    "XETR:DAX",
    /* "GOMARKETS:FTSE100", */
    "NASDAQ:NDX",
    "SP:SPX",
    "HSI:HSI",
    /* "TOCOM:225E", */
  ],
  economy: [
    /* "PYTH:WTI3!", */
    "MIL:BRENT",
    "MCX:GOLD1!",
    "MCX:SILVER1!",
    "OANDA:NATGASUSD",
  ],
};

const Analytics = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // Remove local activeTab state
  // const [activeTab, setActiveTab] = useState('analystViews')
  const [activeInstrument, setActiveInstrument] = useState("forex");
  // Determine active tab from pathname
  const isMarketNews = pathname === "/treadingtools/market";
  const activeTab = isMarketNews ? "marketNews" : "analystViews";

  // Tab click handlers to navigate
  const handleTabClick = (tab) => {
    if (tab === "analystViews" && isMarketNews) {
      navigate("/treadingtools");
    } else if (tab === "marketNews" && !isMarketNews) {
      navigate("/treadingtools/market");
    }
  };

  return (
    <div className="min-h-screen mb-14">
      <div className="">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-start">
            Analytics
          </h1>

          {/* Main Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => handleTabClick("analystViews")}
                className={`py-2 px-1 border-b-2 font-medium text-md ${
                  activeTab === "analystViews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Analyst Views
              </button>
              <button
                onClick={() => handleTabClick("marketNews")}
                className={`py-2 px-1 border-b-2 font-medium text-md ${
                  activeTab === "marketNews"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Market News
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === "analystViews" && (
          <div>
            {/* Instrument Tabs */}
            <div className="mb-6">
              <nav className="flex space-x-8 overflow-scroll sm:overflow-hidden">
                {["forex", "stocks", "indices", "economy", "crypto"].map(
                  (instrument) => (
                    <button
                      key={instrument}
                      onClick={() => setActiveInstrument(instrument)}
                      className={`py-2 px-1 border-b-2 font-medium text-md capitalize ${
                        activeInstrument === instrument
                          ? "border-blue-500 text-gray-900"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {instrument}
                    </button>
                  ),
                )}
              </nav>
            </div>
            {/* Trading Cards */}
            <div className="grid grid-cols-1 sm:grid-col-1 md:grid-col-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {AnaliticViewData[activeInstrument].map((symbol) => (
                <TradingCardsMeter key={symbol} symbol={symbol} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "marketNews" && (
          <div>
            {/* Tags/Currency Pairs Navigation */}
            <div className="mb-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* <MarketNewsWidth /> */}
                <MarketNewsWidth key={0} name={"All Markets"} />
                <MarketNewsWidth
                  key={1}
                  name={"Crypto"}
                  feedMode={"market"}
                  market={"crypto"}
                />
                <MarketNewsWidth
                  key={2}
                  name={"Forex"}
                  feedMode={"market"}
                  market={"forex"}
                />
                <MarketNewsWidth
                  key={3}
                  name={"Stock"}
                  feedMode={"market"}
                  market={"stock"}
                />
                <MarketNewsWidth
                  key={4}
                  name={"Index"}
                  feedMode={"market"}
                  market={"index"}
                />
                <MarketNewsWidth
                  key={5}
                  name={"Futures"}
                  feedMode={"market"}
                  market={"futures"}
                />
                {/* <MarketNewsWidth key={'5'} feedMode={"market"} market={"cfd"} /> */}
                <MarketNewsWidth
                  key={6}
                  name={"Euro / U.S. Dollar"}
                  feedMode={"symbol"}
                  symbol={"CMCMARKETS:GBPUSD"}
                />
                <MarketNewsWidth
                  key={7}
                  name={"Euro / U.S. Dollar"}
                  feedMode={"symbol"}
                  symbol={"FX:EURUSD"}
                />
                <MarketNewsWidth
                  key={8}
                  name={"Alphabet Inc (Google)"}
                  feedMode={"symbol"}
                  symbol={"NASDAQ:GOOGL"}
                />
                <MarketNewsWidth
                  key={9}
                  name={"Apple Inc"}
                  feedMode={"symbol"}
                  symbol={"NASDAQ:AAPL"}
                />
                <MarketNewsWidth
                  key={10}
                  name={"NVIDIA"}
                  feedMode={"symbol"}
                  symbol={"NASDAQ:NVDA"}
                />
                <MarketNewsWidth
                  key={11}
                  name={"Bitcoin / TetherUS"}
                  feedMode={"symbol"}
                  symbol={"BINANCE:BTCUSDT"}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
