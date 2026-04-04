import { useEffect, useRef, useState } from "react";

const tabData = [
  "Forex",
  "Crypto",
  "Shares",
  "Indices",
  "Metals",
  "Energy",
  "ETFs",
];

const tabConfigs = {
  Forex: [
    { name: "FX:EURUSD", displayName: "EUR to USD" },
    { name: "CMCMARKETS:EURAUD", displayName: "EURAUD" },
    { name: "CMCMARKETS:EURJPY", displayName: "EUR to JPY" },
    { name: "CMCMARKETS:AUDNZD", displayName: "AUDNZD" },
    { name: "CMCMARKETS:AUDUSD", displayName: "AUDUSD" },
    { name: "CMCMARKETS:GBPJPY", displayName: "GBPJPY" },
    { name: "CMCMARKETS:GBPUSD", displayName: "GBPUSD" },
    { name: "CMCMARKETS:USDCAD", displayName: "USDCAD" },
    { name: "OANDA:USDCHF", displayName: "USDCHF" },
    { name: "CMCMARKETS:USDJPY", displayName: "USDJPY" },
  ],
  Crypto: [
    { name: "OKX:BTCUSD", displayName: "BTCUSD" },
    { name: "COINBASE:BTCEUR", displayName: "BTCEUR" },
    { name: "VANTAGE:BTCETH", displayName: "BTCETH" },
    { name: "VANTAGE:BTCBCH", displayName: "BTCBCH" },
    { name: "BITSTAMP:ETHUSD", displayName: "ETHUSD" },
    { name: "COINBASE:ETHEUR", displayName: "ETHEUR" },
    { name: "CRYPTO:BNBUSD", displayName: "BNBUSD" },
    { name: "COINBASE:LTCUSD", displayName: "LTCUSD" },
    { name: "EASYMARKETS:MTCUSD", displayName: "MTCUSD" },
    { name: "BITSTAMP:XRPUSD", displayName: "XRPUSD" },
  ],
  Shares: [
    { name: "NASDAQ:AAPL", displayName: "APPLE" },
    { name: "NYSE:BA", displayName: "BOEING" },
    { name: "NASDAQ:COIN", displayName: "COIN" },
    { name: "NASDAQ:MSFT", displayName: "Microsoft" },
    { name: "NASDAQ:NVDA", displayName: "NVIDEA" },
    { name: "NASDAQ:AMZN", displayName: "AMAZON" },
    { name: "NSE:RELIANCE", displayName: "RELIANCE" },
    { name: "NASDAQ:GOOGL", displayName: "GOOGLE" },
    { name: "NASDAQ:NFLX", displayName: "NETFLIX" },
  ],
  Indices: [
    { name: "VANTAGE:DJ30", displayName: "DJ30" },
    { name: "FX:FRA40", displayName: "FRA40" },
    { name: "FOREXCOM:GER40", displayName: "GER40" },
    { name: "PEPPERSTONE:HK50", displayName: "HK50" },
    { name: "FX:NAS100", displayName: "NAS100" },
    { name: "VANTAGE:NIKKEI225", displayName: "NIKKEI225" },
    { name: "VANTAGE:SP500", displayName: "SP500" },
    { name: "VANTAGE:SPI200", displayName: "SPI200" },
    { name: "CAPITALCOM:UK100", displayName: "UK100" },
    { name: "TVC:VIX", displayName: "VIX" },
  ],
  Metals: [
    { name: "OANDA:XAUUSD", displayName: "XAUUSD" },
    { name: "OANDA:XAUEUR", displayName: "XAUEUR" },
    { name: "OANDA:XAUAUD", displayName: "XAUAUD" },
    { name: "OANDA:XAUJPY", displayName: "XAUJPY" },
    { name: "OANDA:XAGAUD", displayName: "XAGAUD" },
    { name: "OANDA:XAGUSD", displayName: "XAGUSD" },
    { name: "OANDA:XPDUSD", displayName: "XPDUSD" },
    { name: "OANDA:XPTUSD", displayName: "XPTUSD" },
    { name: "CAPITALCOM:COPPER", displayName: "COPPER-C" },
  ],
  Energy: [
    { name: "MARKETSCOM:OIL", displayName: "CL-OIL" },
    { name: "HOSE:GAS", displayName: "GAS" },
    { name: "CAPITALCOM:GASOIL", displayName: "GASOIL" },
    { name: "VANTAGE:NG", displayName: "NG" },
    { name: "VANTAGE:UKOUSD", displayName: "UKOUSD" },
    { name: "VANTAGE:UKOUSDFT", displayName: "UKOUSD" },
    { name: "VANTAGE:USOUSD", displayName: "USOUSD" },
  ],
  ETFs: [
    { name: "CBOE:ARKB", displayName: "ARKB" },
    { name: "VANTAGE:BITB", displayName: "BITB" },
    { name: "CBOE:BTCO", displayName: "BTCO" },
    { name: "AMEX:GDXJ", displayName: "GDXJ" },
    { name: "NASDAQ:IBIT", displayName: "IBIT" },
    { name: "AMEX:IWM", displayName: "IWM" },
    { name: "AMEX:SPY", displayName: "SPY" },
    { name: "AMEX:USO", displayName: "USO" },
    { name: "AMEX:XLK", displayName: "XLK" },
    { name: "AMEX:XOP", displayName: "XLK" },
  ],
};

const MarketPlaceSection = () => {
  const [activeTab, setActiveTab] = useState("Forex");
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current; // ✅ snapshot yaha

    if (container) {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }

      document
        .querySelectorAll(
          'script[src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"]'
        )
        .forEach((s) => s.remove());

      const widgetDiv = document.createElement("div");
      widgetDiv.className = "tradingview-widget-container__widget";
      widgetDiv.id = `tv-widget-${activeTab}`;
      container.appendChild(widgetDiv);

      setTimeout(() => {
        if (!container) return;

        if (container.querySelector("script")) return;

        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src =
          "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
        script.innerHTML = JSON.stringify({
          colorTheme: "light",
          locale: "en",
          showSymbolLogo: true,
          width: "100%",
          height: 500,
          symbolsGroups: [
            {
              name: activeTab,
              symbols: tabConfigs[activeTab],
            },
          ],
        });

        container.appendChild(script);
      }, 0);
    }

    return () => {
      const cleanupContainer = container; // ✅ same variable use karo, ref nahi

      if (cleanupContainer) {
        while (cleanupContainer.firstChild) {
          cleanupContainer.removeChild(cleanupContainer.firstChild);
        }
      }

      document
        .querySelectorAll(
          'script[src="https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js"]'
        )
        .forEach((s) => s.remove());
    };
  }, [activeTab]);

  return (
    <div className="w-full max-w-6xl md:max-w-6xl  bg-white p-4 rounded-lg sm:rounded-md shadow-md sm:shadow-sm">
      <ul className="flex gap-6 sm:gap-4 border-b-2 border-gray-200 mb-4 font-sans text-base sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-hide">
        {tabData.map((tab) => (
          <li
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`cursor-pointer py-2 px-2 min-w-max relative transition-colors duration-200 ${
              activeTab === tab
                ? "border-b-2 border-blue-500 font-bold text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </li>
        ))}
      </ul>
      {/* Use a key to force remount on tab change */}
      <div
        className="tradingview-widget-container w-full min-h-[300px] sm:min-h-[200px]"
        ref={containerRef}
        key={activeTab}
      ></div>
    </div>
  );
};

export default MarketPlaceSection;