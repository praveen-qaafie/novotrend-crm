import { FaUser, FaDollarSign, FaStar } from "react-icons/fa";

const InvestmentCard = ({
  image,
  title,
  investors,
  fee,
  risk,
  returnRate,
  isFavorite = false,
}) => {
  return (
    <div className="w-full rounded-lg border border-gray-200 shadow-lg bg-white">
      <div className="flex items-center justify-between p-4">
        {/* Left: Image + Info */}
        <div className="flex items-center gap-4">
          <img
            src={image}
            alt={title}
            className="w-16 h-16 object-cover rounded-md"
          />

          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
              <div className="flex items-center gap-1">
                <FaUser size={12} />
                <span>{investors}</span>
              </div>
              <div className="flex items-center gap-1">
                <FaDollarSign size={12} />
                <span>{fee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Risk, Return, Star */}
        <div className="flex items-center gap-8">
          {/* Risk */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span className="text-sm font-medium text-gray-900">
                {risk}/10
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">Risk</div>
          </div>

          {/* Return */}
          <div className="text-center">
            <div className="text-sm font-bold text-gray-900">{returnRate}</div>
            <div className="text-xs text-gray-500 mt-1">Return</div>
          </div>

          {/* Favorite Star */}
          {isFavorite && <FaStar className={"text-yellow-400"} />}
        </div>
      </div>
    </div>
  );
};

export default InvestmentCard;
