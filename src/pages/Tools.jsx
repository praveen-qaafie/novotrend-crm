import windowTrend from "../assets/img/Windows.png";
import playStore from "../assets/img/gplay.png";
import iosStore from "../assets/img/appstore.png";
import appImage from "../assets/img/app-image.png";
import webTrendImg from "../assets/img/web.png";
import { useSidebar } from "../context/SidebarContext";

export const Tools = () => {
  const { toggle, setToggle, isMobile } = useSidebar();

  return (
    <section className={`mb-10`}>
      <div
        className={``}
        onClick={() => {
          if (isMobile && toggle) {
            setToggle(false);
          }
        }}
      >
        <div className="w-full max-w-[960px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Text Section */}
            <div className="">
              <div className="text-start">
                <h1 className="text-5xl font-bold text-gray-900 mb-4">
                  Novotrend MetaTrader 5 App
                </h1>
                <h2 className="text-lg text-gray-500 mb-6">
                  Trading in financial markets is always at hand. The company's
                  clients receive the best working conditions and the
                  opportunity to trade from anywhere in the world.
                </h2>
              </div>

              {/* Div for Webtrading and Mac App - now using grid for responsiveness */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-xl mx-auto place-items-center">
                <a
                  href="https://download.mql5.com/cdn/web/novotrend.ltd/mt5/novotrend5setup.exe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center w-full"
                >
                  <img
                    src={windowTrend}
                    alt="Download for Windows"
                    className="h-12 md:h-16 object-contain mx-auto"
                  />
                </a>
                <a
                  href="https://download.mql5.com/cdn/mobile/mt5/ios?server=Novotrend-MT5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center w-full"
                >
                  <img
                    src={iosStore}
                    alt="Download for iOS"
                    className="h-12 md:h-16 object-contain mx-auto"
                  />
                </a>
                <a
                  href="https://download.mql5.com/cdn/mobile/mt5/android?server=Novotrend-MT5"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center w-full"
                >
                  <img
                    src={playStore}
                    alt="Download for Android"
                    className="h-12 md:h-16 object-contain mx-auto"
                  />
                </a>
                <a
                  href="https://webtrading.novotrend.co/terminal"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex justify-center items-center w-full"
                >
                  <img
                    src={webTrendImg}
                    alt="Web Trading"
                    className="h-12 md:h-16 object-contain mx-auto"
                  />
                </a>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex justify-center md:justify-end">
              <div className="relative w-72 h-56 md:w-full md:h-[500px] bg-gradient-to-tr from-white via-blue-100 to-gray-100 rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] shadow-xl flex items-center justify-center overflow-hidden">
                <img
                  src={appImage}
                  alt="App Preview"
                  className="w-32 md:w-96 object-contain z-10"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
