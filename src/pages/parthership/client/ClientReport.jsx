const clientData = [
  {
    id: "9221e48b",
    status: "Inactive",
    progress: [
      "Client does not have a verified Personal Area",
      "Client didn't make a deposit yet",
      "Client didn't start trading yet",
    ],
    rewards: 0,
    rebates: 0,
    comment: "",
  },
];

export default function ClientReport() {
  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Clients</h1>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">1</span>
          <span className="text-gray-600 text-sm">Clients</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">0.0000</span>
          <span className="text-gray-600 text-sm">Volume (lots)</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">0.0000</span>
          <span className="text-gray-600 text-sm">Volume (Min. USD)</span>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center border border-gray-200">
          <span className="text-2xl font-bold text-gray-900">0.0000</span>
          <span className="text-gray-600 text-sm">Rewards</span>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4">
        <button className="border border-gray-300 rounded px-3 py-1.5 text-gray-700 text-sm flex items-center hover:bg-gray-50">
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="9" x2="15" y2="15" />
            <line x1="15" y1="9" x2="9" y2="15" />
          </svg>
          Filters
        </button>
        <div className="text-sm text-gray-500">
          Sort by:{" "}
          <span className="font-medium text-blue-600 cursor-pointer">
            Client ID
          </span>
          <svg
            className="w-4 h-4 inline ml-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Client ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Client progress
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Rewards
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Rebates
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {clientData.map((client) => (
              <tr key={client.id} className="border-b border-gray-100">
                <td className="px-4 py-3 font-mono text-gray-900 bg-gray-50">
                  {client.id}
                </td>
                <td className="px-4 py-3">
                  <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Inactive
                  </span>
                </td>
                <td className="px-4 py-3 relative">
                  <div className="flex items-center gap-0.5 ">
                    <div className="group relative">
                      <div
                        className=" text-gray-400 cursor-pointer hover:text-gray-600"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <div className="flex items-center gap-0.5">
                          <div className="w-9 h-2.5 bg-gray-200 rounded-l relative"></div>
                          <div className="w-9 h-2.5 bg-gray-200 relative"></div>
                          <div className="w-9 h-2.5 bg-gray-200 rounded-r relative"></div>
                        </div>
                        <div className="absolute left-0 top-6 z-10 hidden group-hover:block bg-white border border-gray-200 rounded-lg shadow-lg p-3 min-w-[280px] text-xs">
                          <ul className="space-y-1.5">
                            {client.progress.map((msg, i) => (
                              <li
                                key={i}
                                className="flex items-start text-red-600"
                              >
                                <svg
                                  className="w-3 h-3 mr-2 mt-0.5 text-red-500 flex-shrink-0"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2a1 1 0 002 0V7zm-1 4a1 1 0 100 2 1 1 0 000-2z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span>{msg}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-900">0.00 USD</td>
                <td className="px-4 py-3">
                  <button className="flex items-center border border-gray-300 rounded px-2 py-1 text-gray-600 text-xs hover:bg-gray-50">
                    <svg
                      className="w-3 h-3 mr-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add comment
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-900">0.00 USD</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end gap-5 px-4 py-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          <div>
            Items per page <span className="font-medium text-gray-900">10</span>
            <svg
              className="w-4 h-4 inline ml-1"
              fill="none"
              stroke="blue"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </div>

          <div>1–1 of 1</div>
          <div className="flex items-center space-x-2">
            <button className="p-1 text-gray-300" disabled>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <button className="p-1 text-gray-300" disabled>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <polyline points="9,18 15,12 9,6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
