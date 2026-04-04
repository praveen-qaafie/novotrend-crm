import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function MarketNewsWidth({ feedMode = "all", market, symbol, name }) {
  const container = useRef();

  useEffect(() => {
    const currentContainer = container.current; // ✅ copy ref here

    if (currentContainer) {
      currentContainer.innerHTML = "";
    }

    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    currentContainer && currentContainer.appendChild(widgetDiv);

    const timeoutId = setTimeout(() => {
      if (!currentContainer) return;
      if (currentContainer.querySelector("script")) return;

      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
      script.type = "text/javascript";
      script.async = true;

      const config = {
        displayMode: "regular",
        feedMode: feedMode,
        colorTheme: "light",
        isTransparent: false,
        locale: "en",
        width: "100%",
        height: "100%",
      };

      if (feedMode === "market" && market) {
        config.market = market;
      } else if (feedMode === "symbol" && symbol) {
        config.symbol = symbol;
      }

      script.innerHTML = JSON.stringify(config);
      currentContainer.appendChild(script);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, [feedMode, market, symbol]);

  return (
    <div className="p-2">
      <h2 className="text-lg text-start ml-2 font-semibold">{name}</h2>
      <div className="tradingview-widget-container min-h-80" ref={container}>
        <div className="tradingview-widget-copyright">
          <a
            href="https://www.tradingview.com/"
            rel="noopener noreferrer nofollow" // ✅ updated
            target="_blank"
          >
            <span className="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      </div>
    </div>
  );
}

MarketNewsWidth.propTypes = {
  feedMode: PropTypes.string,
  market: PropTypes.string,
  symbol: PropTypes.string,
  name: PropTypes.string,
};

export default MarketNewsWidth;
