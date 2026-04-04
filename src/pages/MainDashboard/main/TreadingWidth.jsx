// TradingViewWidget.jsx
import { useEffect, useRef, memo } from "react";

function TradingViewWidget() {
  const container = useRef();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;

    // Responsive config
    script.text = JSON.stringify({
      colorTheme: "dark",
      locale: "en",
      largeChartUrl: "",
      isTransparent: false,
      showSymbolLogo: true,
      backgroundColor: "#0F0F0F",
      support_host: "https://www.tradingview.com",
      width: "100%", // 👈 responsive width
      height: "100%", // 👈 responsive height
      symbolsGroups: [
        {
          name: "Forex",
          symbols: [
            { name: "FX:EURUSD", displayName: "EUR to USD" },
            { name: "FX:EURAUD", displayName: "EUR to AUD" },
            { name: "FX:EURJPY", displayName: "EUR to JPY" },
            { name: "FX:AUDNZD", displayName: "AUD to NZD" },
            { name: "FX:AUDUSD", displayName: "AUD to USD" },
            { name: "FX:GBPJPY", displayName: "GBP to JPY" },
            { name: "FX:GBPUSD", displayName: "GBP to USD" },
            { name: "FX:USDCAD", displayName: "USD to CAD" },
            { name: "FX:USDCHF", displayName: "USD to CHF" },
            { name: "FX:USDJPY", displayName: "USD to JPY" },
          ],
        },
      ],
    });

    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={container}
      style={{ width: "100%", height: "450px" }} // 👈 adjust height as needed
    >
      <div className="tradingview-widget-container__widget"></div>
    </div>
  );
}

export default memo(TradingViewWidget);
