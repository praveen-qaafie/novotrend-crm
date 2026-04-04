const TransactionTableAll = ({ data }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <table className="min-w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Sr No.
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Date
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Details
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Credit
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Debit
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Balance
          </th>
        </tr>
      </thead>

      {data.length === 0 ? (
        <tbody>
          <tr>
            <td
              colSpan="6"
              className="px-4 py-10 text-center text-gray-500 text-sm"
            >
              No Records Found...
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {data.map((transaction, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.Srno}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.date}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.Details}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.Credit}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.Debit}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm font-medium">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    Number(transaction.Balance) < 0
                      ? "bg-[#FEF3F2] text-[#B42318]"
                      : "bg-[#ECFDF3] text-[#027A48]"
                  }`}
                >
                  {transaction.Balance}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
);

export default TransactionTableAll;
