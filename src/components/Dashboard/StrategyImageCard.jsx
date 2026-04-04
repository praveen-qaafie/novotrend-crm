export default function StrategyImageCard({
  name,
  backgroundImage,
  returnPercentage,
  risk,
  investorCount,
  fee,
  badgeText,
  badgeColor = "blue",
  avatar,
}) {
  const getBadgeClasses = () => {
    const baseClasses =
      "absolute top-2 right-2 px-2 py-1 rounded text-xs font-medium";
    switch (badgeColor) {
      case "purple":
        return `${baseClasses} bg-purple-600 text-white`;
      case "green":
        return `${baseClasses} bg-green-600 text-white`;
      case "blue":
        return `${baseClasses} bg-blue-600 text-white`;
      case "red":
        return `${baseClasses} bg-red-600 text-white`;
      default:
        return `${baseClasses} bg-gray-600 text-white`;
    }
  };

  return (
    <div className="relative bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Background Image */}
      <div
        className="h-32 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${backgroundImage || "/Trade.jpg"})` }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Badge */}
        {badgeText && <div className={getBadgeClasses()}>{badgeText}</div>}

        {/* Favorite Icon */}
        <button className="absolute top-2 left-2 text-white hover:text-yellow-400 transition-colors">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.915a1 1 0 00.95-.69l1.519-4.674z"
            />
          </svg>
        </button>

        {/* Strategy Name */}
        <div className="absolute bottom-2 left-2">
          <h3 className="text-white font-semibold text-sm mb-1">{name}</h3>
          <div className="flex items-center gap-2 text-white text-xs">
            <span>$ {fee || "30%"}</span>
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              {investorCount}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="p-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-lg font-bold text-gray-900">
              {returnPercentage}%
            </div>
            <div className="text-xs text-gray-500">Return</div>
          </div>
          {risk && (
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{risk}/10</div>
              <div className="text-xs text-gray-500">Risk</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
