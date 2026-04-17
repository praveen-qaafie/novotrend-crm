import { FaTelegramPlane, FaWhatsapp, FaComments } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import ChatAgent from "../../assets/img/chat_agent2.webp";
import { Link } from "react-router-dom";
import { Hr } from "../Common/Hr";

const PromotionCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white px-3 py-2">
        <BiSupport size={18} /> Support
      </h3>
      <div className="w-full max-w-xs mx-auto space-y-4">
        <div className="bg-white rounded-lg p-6 text-center space-y-2">
          <p className="text-sm text-gray-600">Call us:</p>
          <p className="text-sm font-medium text-blue-600">+44 7472 339580</p>
          <div className="flex justify-center">
            <img
              src={ChatAgent}
              alt="Support Agent"
              className="rounded-full w-20 h-20 object-cover"
            />
          </div>
          <p className="text-sm text-gray-600">
            Or Start Live Chat with our support agent
          </p>
          <div className="space-y-2">
            <Link to="/support">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-md hover:from-blue-600 hover:to-blue-800 transition">
                <FaComments size={18} /> Chat with us
              </button>
            </Link>
            <a
              href="https://wa.me/447472339580?text=Hello%20I%20have%20a%20query%20about%20your%20services."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
            >
              <FaWhatsapp size={18} /> WhatsApp
            </a>
            <a
              href="https://t.me/novotrendofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
            >
              <FaTelegramPlane size={18} /> Telegram
            </a>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 text-center ">
          <h3 className="text-lg font-semibold text-blue-600">
            🎁 Novo Promotions{" "}
          </h3>
          <p className="text-sm text-gray-600">
            Stay tuned! You’ll be the first to know whenever Novotrend launches
            a new bonus or promotion.
          </p>
          <Hr />
          <p className="text-sm text-gray-600">
            This website is protected with 256-bit SSL encryption for a secured
            online experience.
          </p>
          <h3 className="text-lg font-semibold text-blue-600 !mt-10">
            🔒 Safety of your funds
          </h3>
          <p className="text-sm text-gray-600">
            Novotrend uses high-end security systems and tools to safeguard your
            funds and identity.
          </p>
        </div>
      </div>
    </div>
  );
};
export default PromotionCard;
