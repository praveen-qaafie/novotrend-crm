export default function BestStrategyCard({ 
  title,
  name, 
  avatar, 
  returnPercentage,
  icon = "🔥"
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">{icon}</span>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src={avatar || "/nft-coin.png"}
            alt={name}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-medium text-gray-900">{name}</h4>
            <div className="flex items-center gap-1 text-sm text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Return {returnPercentage}%
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-5 py-1 text-sm text-gray-600 bg-gray-100 border-transparent hover:bg-gray-200 hover:border-gray-900 hover:text-gray-800 rounded-md">
            Details
          </button>
          <button className="px-5 py-1 bg-blue-400 text-white text-sm font-medium rounded hover:bg-blue-500">
            Invest 10 USD
          </button>
        </div>
      </div>
    </div>
  );
}
