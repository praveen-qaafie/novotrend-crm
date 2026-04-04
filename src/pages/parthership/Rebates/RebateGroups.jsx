import { useState } from "react";
import RebateNav from "./RebateNav";

export default function RebateGroups() {
  const [groupName, setGroupName] = useState("All groups");
  const [groupType, setGroupType] = useState("All");
  const [rebatePeriod, setRebatePeriod] = useState("All periods");

  return (
    <div className="bg-white min-h-screen">
      <RebateNav />

      <div className="px-8 py-6">
        {/* Stats Section - Override the nav stats with page-specific ones */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              <span>0</span>
            </div>
            <div className="text-sm text-gray-500">Clients in groups total</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-900 mb-1">
              <span>0</span>
            </div>
            <div className="text-sm text-gray-500">Groups total</div>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="grid grid-cols-4 gap-6 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group name
              </label>
              <select
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="All groups">All groups</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group type
              </label>
              <select
                value={groupType}
                onChange={(e) => setGroupType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="All">All</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rebate period
              </label>
              <select
                value={rebatePeriod}
                onChange={(e) => setRebatePeriod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="All periods">All periods</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center text-gray-600 hover:text-gray-800 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="size-5 mr-2"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                    clipRule="evenodd"
                  />
                </svg>
                Clear filters
              </button>
              <button className="bg-yellow-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Create Group Button */}
        <div className="mb-6">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Create group
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-white border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-1/5">
                  <div className="flex items-center">
                    Group
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5l0 14" />
                      <path d="M16 15l-4 4" />
                      <path d="M8 15l4 4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-1/5">
                  <div className="flex items-center">
                    Type
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5l0 14" />
                      <path d="M16 15l-4 4" />
                      <path d="M8 15l4 4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-1/5">
                  <div className="flex items-center">
                    Rebate period
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5l0 14" />
                      <path d="M16 15l-4 4" />
                      <path d="M8 15l4 4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-1/5">
                  Rebate
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-1/5">
                  <div className="flex items-center">
                    Client
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 5l0 14" />
                      <path d="M16 15l-4 4" />
                      <path d="M8 15l4 4" />
                    </svg>
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 w-20">
                  {/* Actions column */}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">{/* Empty table body */}</tbody>
          </table>

          {/* No Data State */}
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <svg
              className="w-12 h-12 mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
              <path d="M4 13h3l3 3h4l3-3h3" />
            </svg>
            <span className="text-gray-600 font-medium">No data</span>
          </div>
        </div>
      </div>
    </div>
  );
}
