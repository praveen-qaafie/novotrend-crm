export default function StrategyCard({
  rank,
  name,
  avatar,
  returnPercentage,
  drawdown,
  risk,
  investors,
  isFavorite = false,
  badgeText = null,
  badgeColor = "purple",
  layout = "list", // "list" or "grid"
}) {
  const getBadgeClasses = () => {
    const baseClasses =
      "absolute -top-2 -right-2 text-xs font-bold px-2 py-1 rounded-full text-white";
    switch (badgeColor) {
      case "purple":
        return `${baseClasses} bg-purple-500`;
      case "blue":
        return `${baseClasses} bg-blue-500`;
      case "green":
        return `${baseClasses} bg-green-500`;
      default:
        return `${baseClasses} bg-purple-500`;
    }
  };

  if (layout === "grid") {
    return (
      <div className="flex items-center justify-between py-5 px-4 border-b border-gray-200 bg-white hover:bg-gray-50 transition">
        {/* Left: Rank and Image */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="text-xl font-semibold text-gray-800 w-6 text-center">
            {rank}
          </div>

          <div className="relative shrink-0">
            <img
              src={avatar || "/nft-coin.png"}
              alt={name}
              className="w-14 h-14 rounded-md object-cover"
            />
            {badgeText && <div className={getBadgeClasses()}>{badgeText}</div>}
            {isFavorite && (
              <div className="absolute -top-2 -left-2 text-yellow-500">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            )}
          </div>

          {/* Name and Stats */}
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            <div className="flex gap-3 text-sm text-gray-500 mt-1 flex-wrap">
              <span className="flex items-center gap-1">
                <svg
                  className="w-3.5 h-3.5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                {returnPercentage}%
              </span>
              {drawdown && (
                <span className="flex items-center gap-1">
                  <svg
                    className="w-3.5 h-3.5 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  {drawdown}%
                </span>
              )}
              {risk && <span>Risk {risk}</span>}
            </div>
          </div>
        </div>

        {/* Right: Investors */}
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-900">
            {investors.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500">Investors</div>
        </div>
      </div>
    );
  }

  // Default list layout
  return (
    <div className="flex items-center justify-between py-4 px-4 border-b border-gray-100 last:border-b-0">
      {/* Left side - Rank and Strategy Info */}
      <div className="flex items-center gap-4">
        <div className="text-lg font-medium text-gray-700 w-6">{rank}</div>

        {isFavorite && (
          <div className="text-yellow-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
        )}

        <div className="relative">
          <img
            src={avatar || "/nft-coin.png"}
            alt={name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          {badgeText && <div className={getBadgeClasses()}>{badgeText}</div>}
        </div>

        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
            <span className="flex items-center gap-1">
              <svg
                className="w-4 h-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
              {returnPercentage}%
            </span>
            {drawdown && (
              <span className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
                {drawdown}%
              </span>
            )}
            {risk && <span>Risk {risk}</span>}
          </div>
        </div>
      </div>

      {/* Right side - Investors count */}
      <div className="text-right">
        <div className="text-lg font-medium text-gray-900">
          {investors.toLocaleString()}
        </div>
        <div className="text-sm text-gray-500">Investors</div>
      </div>
    </div>
  );
}
