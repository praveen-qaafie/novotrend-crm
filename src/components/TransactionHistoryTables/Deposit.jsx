import { Link } from "react-router-dom";

const Deposit = ({ data }) => (
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
            Type
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Receipt
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Note
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Status
          </th>
          <th className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold text-gray-600">
            Remark
          </th>
        </tr>
      </thead>
      {data.length === 0 ? (
        <tbody>
          <tr>
            <td
              colSpan="7"
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
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700 font-medium">
                {transaction.date}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700 font-medium">
                {transaction.amount}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700 font-medium">
                {transaction.payment_type}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center">
                {transaction.req_image === "" ? (
                  <span className="text-gray-400"></span>
                ) : (
                  <Link
                    to={transaction.req_image}
                    target="_blank"
                    className="inline-flex justify-center items-center border border-gray-300 rounded-lg overflow-hidden"
                  >
                    <img
                      src={transaction.req_image || "/placeholder_img.png"}
                      alt=""
                      className="w-10 h-10 object-cover"
                      loading="lazy"
                      width={40}
                      height={40}
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder_img.png";
                      }}
                    />
                  </Link>
                )}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.note}
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm font-semibold">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    transaction.status === "Pending"
                      ? "bg-[#F4F3FF] text-[#5925DC]"
                      : transaction.status === "Approved"
                        ? "bg-[#ECFDF3] text-[#027A48]"
                        : "bg-[#FEF3F2] text-[#B42318]"
                  }`}
                >
                  {transaction.status}
                </span>
              </td>
              <td className="border border-gray-200 px-3 py-3 text-center text-sm text-gray-700">
                {transaction.remark}
              </td>
            </tr>
          ))}
        </tbody>
      )}
    </table>
  </div>
);

export default Deposit;
