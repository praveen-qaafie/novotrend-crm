import { useEffect, useRef } from "react";

function TradingCardsMeter({ symbol = "NASDAQ:AAPL" }) {
  const container = useRef();

  useEffect(() => {
    const currentContainer = container.current; // ✅ Copy ref to variable

    // Clean up previous widget
    if (currentContainer) {
      currentContainer.innerHTML = "";
    }

    // Add the widget container div
    const widgetDiv = document.createElement("div");
    widgetDiv.className = "tradingview-widget-container__widget";
    currentContainer && currentContainer.appendChild(widgetDiv);

    // Delay script injection to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      if (!currentContainer) return;
      // Prevent duplicate script injection
      if (currentContainer.querySelector("script")) return;
      const script = document.createElement("script");
      script.src =
        "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `{
        "colorTheme": "light",
        "displayMode": "single",
        "isTransparent": false,
        "locale": "en",
        "interval": "1m",
        "disableInterval": false,
        "width": 350,
        "height": 400,
        "symbol": ${JSON.stringify(symbol)},
        "showIntervalTabs": true
      }`;
      currentContainer.appendChild(script);
    }, 0);

    // Cleanup on unmount
    return () => {
      clearTimeout(timeoutId);
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, [symbol]);

  return (
    <div className="tradingview-widget-container" ref={container}>
      {/* The widget and script will be injected here */}
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer nofollow" // ✅ Added noreferrer
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default TradingCardsMeter;
