const TableRow = ({ name, change, chgPercent, open, high, low, prev }) => {
  const isPositive = parseFloat(change) > 0;

  return (
    <tr className="border-b">
      {/* Name Column */}
      <td className="py-3 px-4 flex gap-3 items-center space-x-2">
        <div className="flex relative">
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Flag_of_Europe.svg/2560px-Flag_of_Europe.svg.png"
            }
            alt=""
            className="w-5 h-5 object-cover rounded-full"
          />
          <img
            src={
              "https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg"
            }
            alt=""
            className="w-5 h-5 object-cover absolute left-3 rounded-full border border-white"
          />
        </div>
        <span className="text-gray-800">{name}</span>
      </td>

      {/* Change Column */}
      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            isPositive
              ? "bg-[#ECFDF3] text-[#27A48]"
              : "bg-[#FFFAEB] text-[#B54708]"
          }`}
        >
          {change}
        </span>
      </td>

      {/* Change Percentage */}
      <td className="py-3 px-4 text-center">
        <span
          className={`px-2 py-1 rounded-full text-sm ${
            isPositive
              ? "bg-[#ECFDF3] text-[#27A48]"
              : "bg-[#FFFAEB] text-[#B54708]"
          }`}
        >
          {chgPercent}%
        </span>
      </td>

      {/* Open Column */}
      <td className="py-3 px-4 text-gray-800 text-center">{open}</td>

      {/* High Column */}
      <td className="py-3 px-4 text-gray-800 text-center">{high}</td>

      {/* Low Column */}
      <td className="py-3 px-4 text-gray-800 text-center">{low}</td>

      {/* Previous Column */}
      <td className="py-3 px-4 text-gray-800 text-center">{prev}</td>
    </tr>
  );
};

export default TableRow;