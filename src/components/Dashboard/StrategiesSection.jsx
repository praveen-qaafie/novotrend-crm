export default function StrategiesSection({
  title,
  showSeeAll = true,
  children,
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {showSeeAll && (
          <button className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-800">
            See all
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        )}
      </div>
      {children}
    </div>
  );
}
