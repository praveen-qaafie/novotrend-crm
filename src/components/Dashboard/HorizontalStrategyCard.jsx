export default function HorizontalStrategyCard({
  name,
  backgroundImage,
  returnPercentage,
}) {
  return (
    <div className="flex-shrink-0 w-32 flex flex-col items-center">
      {/* Strategy Image */}
      <div className="w-28 h-16 rounded-xl overflow-hidden bg-black flex items-center justify-center">
        <img
          src={backgroundImage}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      {/* Strategy Info */}
      <div className="mt-2 w-full text-center">
        <h4 className="text-sm font-semibold text-gray-900 truncate leading-tight">
          {name}
        </h4>
        <div className="flex items-center justify-center gap-1 mt-1">
          <svg
            className="w-4 h-4 text-gray-700"
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
          <span className="text-sm font-medium text-gray-900">
            {returnPercentage}%
          </span>
        </div>
      </div>
    </div>
  );
}
