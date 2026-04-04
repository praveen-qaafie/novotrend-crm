export default function RecentlyViewedCard({ name, avatar, returnPercentage }) {
  return (
    <div className="w-32 flex items-center flex-col">
      <img
        src={avatar}
        alt={name}
        className="w-20 h-20 rounded-lg object-cover mb-2"
      />
      <h4 className="font-semibold text-gray-900 text-md mb-1 truncate">
        {name}
      </h4>
      <div className="flex items-center gap-1 text-sm text-green-600">
        <svg
          className="w-3 h-3"
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
      </div>
    </div>
  );
}