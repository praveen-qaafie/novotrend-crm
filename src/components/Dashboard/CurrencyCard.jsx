export default function CurrencyCard({ currencyCode, onClick, Icon }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center p-3 border border-gray-200 rounded-xl hover:bg-gray-100 transition-all min-w-[72px] w-full sm:w-auto"
    >
      <div className="flex items-center justify-center w-12 h-12 mb-2 rounded-full overflow-hidden bg-gray-100">
        <img
          src={
            "https://upload.wikimedia.org/wikipedia/en/thumb/4/41/Flag_of_India.svg/1920px-Flag_of_India.svg.png"
          }
          alt="Icon"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-sm font-semibold text-gray-800">
        {currencyCode}
      </span>
    </button>
  );
}
