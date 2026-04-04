import { useEffect, useRef } from "react";
import PropTypes from "prop-types";

function EconomyCalendarWidth({ name = "Economic Calendar" }) {
  const container = useRef();

  useEffect(() => {
    const currentContainer = container.current; // ✅ copy ref to a variable

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
        "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
      script.type = "text/javascript";
      script.async = true;
      const config = {
        colorTheme: "light",
        isTransparent: false,
        locale: "en",
        countryFilter:
          "ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu",
        importanceFilter: "-1,0,1",
        width: "100%",
        height: "100%",
      };
      script.innerHTML = JSON.stringify(config);
      currentContainer.appendChild(script);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      if (currentContainer) {
        currentContainer.innerHTML = "";
      }
    };
  }, []); // ✅ dependencies are fine

  return (
    <div className="tradingview-widget-container min-h-80" ref={container}>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener noreferrer nofollow" // ✅ add noreferrer
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

EconomyCalendarWidth.propTypes = {
  name: PropTypes.string,
};

export default EconomyCalendarWidth;
