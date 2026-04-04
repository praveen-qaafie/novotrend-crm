export default function MyActiveStrategyCard({
  name,
  returnPercentage,
  investors,
}) {
  return (
    <div className="border w-72 flex flex-col items-start border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
      <h3 className="font-medium text-gray-900 mb-2">{name}</h3>
      <div className="text-sm text-gray-500">
        <span>Return {returnPercentage}%</span>
        <span>Investors {investors}</span>
      </div>
    </div>
  );
}
