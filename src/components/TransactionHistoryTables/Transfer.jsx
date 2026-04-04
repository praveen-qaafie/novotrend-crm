const Transfer = ({ transferdata }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
    <table className="min-w-full border-collapse border border-gray-200">
      <thead className="bg-gray-100">
        <tr>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Date
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Amount
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            From
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            To
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Note
          </th>
        </tr>
      </thead>
      {transferdata.length === 0 ? (
        <tbody>
          <tr>
            <td
              colSpan="5"
              className="px-4 py-10 text-center text-gray-500 text-sm"
            >
              No Records Found...
            </td>
          </tr>
        </tbody>
      ) : (
        <tbody>
          {transferdata.map((transaction, index) => (
            <tr
              key={index}
              className="hover:bg-gray-50 transition-colors duration-200"
            >
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700 font-medium">
                {transaction.date}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {Number(transaction.amount || 0).toFixed(2)}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.fromaccno}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.toaccno}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.note}
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
);

export default Transfer;
