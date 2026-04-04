import { useEffect, useRef } from "react";

const TradingViewWidget = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      // Clear previous content
      container.innerHTML = '';

      // Create the main container div
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'tradingview-widget-container';
      widgetContainer.style.width = '100%';
      widgetContainer.style.height = '100%';

      // Create the script element
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        "width": "100%",
        "height": "100%",
        "symbolsGroups": [
          {
            "name": "Indices",
            "originalName": "Indices",
            "symbols": [
              { "name": "FOREXCOM:SPXUSD", "displayName": "S&P 500 Index" },
              { "name": "FOREXCOM:NSXUSD", "displayName": "US 100 Cash CFD" },
              { "name": "FOREXCOM:DJI", "displayName": "Dow Jones Industrial Average Index" },
              { "name": "INDEX:NKY", "displayName": "Japan 225" },
              { "name": "INDEX:DEU40", "displayName": "DAX Index" },
              { "name": "FOREXCOM:UKXGBP", "displayName": "FTSE 100 Index" }
            ]
          },
          {
            "name": "Forex",
            "originalName": "Forex",
            "symbols": [
              { "name": "FX:EURUSD", "displayName": "EUR to USD" },
              { "name": "FX:GBPUSD", "displayName": "GBP to USD" },
              { "name": "FX:USDJPY", "displayName": "USD to JPY" },
              { "name": "FX:USDCHF", "displayName": "USD to CHF" },
              { "name": "FX:AUDUSD", "displayName": "AUD to USD" },
              { "name": "FX:USDCAD", "displayName": "USD to CAD" }
            ]
          },
          {
            "name": "Futures",
            "originalName": "Futures",
            "symbols": [
              { "name": "BMFBOVESPA:ISP1!", "displayName": "S&P 500 Index Futures" },
              { "name": "BMFBOVESPA:EUR1!", "displayName": "Euro Futures" },
              { "name": "PYTH:WTI3!", "displayName": "WTI CRUDE OIL" },
              { "name": "BMFBOVESPA:ETH1!", "displayName": "Hydrous ethanol" },
              { "name": "BMFBOVESPA:CCM1!", "displayName": "Corn" }
            ]
          },
          {
            "name": "Bonds",
            "originalName": "Bonds",
            "symbols": [
              { "name": "EUREX:FGBL1!", "displayName": "Euro Bund" },
              { "name": "EUREX:FBTP1!", "displayName": "Euro BTP" },
              { "name": "EUREX:FGBM1!", "displayName": "Euro BOBL" }
            ]
          },
          {
            "name": "Metals",
            "symbols": [
              { "name": "CAPITALCOM:GOLD", "displayName": "XAUUSD" },
              { "name": "CAPITALCOM:SILVER", "displayName": "XAGUSD" },
              { "name": "OANDA:XPTUSD", "displayName": "XPTUSD" },
              { "name": "OANDA:XPDUSD", "displayName": "XPDUSD" },
              { "name": "PEPPERSTONE:ALUMINIUM", "displayName": "Aluminium" },
              { "name": "CAPITALCOM:COPPER", "displayName": "XCUUSD" }
            ]
          }
        ],
        "showSymbolLogo": true,
        "isTransparent": false,
        "colorTheme": "light",
        "locale": "en"
      });

      // Create the widget div that will be replaced by the script
      const widgetDiv = document.createElement('div');
      widgetDiv.className = 'tradingview-widget-container__widget';

      // Append elements
      widgetContainer.appendChild(widgetDiv);
      widgetContainer.appendChild(script);
      container.appendChild(widgetContainer);

      // Create copyright element
      // const copyright = document.createElement('div');
      // copyright.className = 'tradingview-widget-copyright';
      // copyright.innerHTML = `
      //   <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
      //     <span className="blue-text">Track all markets on TradingView</span>
      //   </a>
      // `;
      // container.appendChild(copyright);

    } catch (err) {
      console.error("Failed to load TradingView widget:", err);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  return (
    <div
      className="bg-white shadow-lg rounded-lg p-4"
      style={{ height: "500px",width:'800px' }}
    >
      <div
        ref={containerRef}
        style={{ height: "100%", width: "100%" }}
      />
    </div>
  );
};

export default TradingViewWidget;
