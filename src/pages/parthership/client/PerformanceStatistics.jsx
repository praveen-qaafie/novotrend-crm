import { useState } from "react";
import { FaChevronDown, FaRegCopy } from "react-icons/fa";

export default function ClientPerformanceStatistics() {
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);

  const countries = ["All", "IN", "MY"];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-8xl mx-auto ">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Performance statistics
          </h1>
          <button className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2">
            Switch to new performance report
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pt-4">
          <div className="flex gap-6">
            <span className="text-sm font-medium text-gray-900 pb-2">
              Group by:
            </span>
            <button className="text-sm text-blue-600 font-medium pb-2 border-b-2 border-blue-600">
              Link
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Source
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Day
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Week
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Month
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Year
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Country
            </button>
            <button className="text-sm text-gray-600 hover:text-gray-900 pb-2">
              Campaign
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 ">
          <div className="flex items-end w-full gap-4">
            <div className="flex flex-col w-1/5 gap-2">
              <label className="text-sm font-medium text-gray-700">
                Period
              </label>
              <input
                type="text"
                value="29 May, 2025 - 27 Jun, 2025"
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
                readOnly
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Country
              </label>
              <div className="relative">
                <button
                  onClick={() =>
                    setIsCountryDropdownOpen(!isCountryDropdownOpen)
                  }
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white flex items-center gap-2 min-w-[100px]"
                >
                  {selectedCountry}
                  <FaChevronDown className="w-4 h-4" />
                </button>
                {isCountryDropdownOpen && (
                  <div className="absolute top-full left-0 mt-1  bg-white border border-gray-300 rounded-md shadow-lg z-10">
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsCountryDropdownOpen(false);
                        }}
                        className="block w-full px-3 py-2 text-left text-sm hover:bg-gray-50"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className="flex gap-1 text-sm text-gray-600 mb-3 hover:text-gray-900">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5"
              >
                <path
                  fill-rule="evenodd"
                  d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z"
                  clip-rule="evenodd"
                />
              </svg>
              Clear filters
            </button>

            <button className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-sm font-medium rounded-md">
              Apply
            </button>
          </div>
        </div>

        {/* Update Notice */}
        <div className="px-6 py-3 ">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <div className="w-4 h-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
              <div>!</div>
            </div>
            The report is updated once in 2 hours.
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">3</div>
              <div className="text-sm text-gray-600">Clicks</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">1</div>
              <div className="text-sm text-gray-600">Registrations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                33<span className="text-lg">.33 %</span>
              </div>
              <div className="text-sm text-gray-600">Conversion</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">0</div>
              <div className="text-sm text-gray-600">Start Trading</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                0<span className="text-lg">.0000</span>
              </div>
              <div className="text-sm text-gray-600">Volume (Min. USD)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                0<span className="text-lg">.0000</span>
              </div>
              <div className="text-sm text-gray-600">Volume (lots)</div>
            </div>
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-gray-900 mb-1">
                0<span className="text-lg">.00</span>
              </div>
              <div className="text-sm text-gray-600">Profit (USD)</div>
            </div>
          </div>

          {/* Additional Profit Card */}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 text-sm font-medium text-gray-700">
                    Partner link
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-700">
                    Clicks
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-700">
                    Registrations
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-700">
                    Conversion
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-700">
                    Start Trading
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-700">
                    <div>Volume</div>
                    <div className="flex justify-center gap-4 mt-1">
                      <span className="text-purple-600 text-xs">Lots</span>
                      <span className="text-gray-500 text-xs">Min. USD</span>
                    </div>
                  </th>
                  <th className="text-center py-3 text-sm font-medium text-gray-700">
                    <div className="flex items-center justify-center gap-1">
                      Profit
                      <FaChevronDown className="w-3 h-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href="#"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        track.exness.com/a/
                        <br />
                        sokujhxpuzex_gI3T
                      </a>
                      <FaRegCopy className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-pointer" />
                    </div>
                  </td>
                  <td className="text-center py-4 text-sm">3</td>
                  <td className="text-center py-4 text-sm">1</td>
                  <td className="text-center py-4 text-sm">33.33 %</td>
                  <td className="text-center py-4 text-sm">0</td>
                  <td className="text-center py-4 text-sm">0.00</td>
                  <td className="text-center py-4 text-sm">0.00 USD</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Export Options */}
          <div className="flex justify-end gap-4 mt-6">
            <span className="text-sm text-gray-600">Export to:</span>
            <button className="text-sm text-blue-600 border-b-1 border-dashed hover:underline">
              CSV
            </button>
            <button className="text-sm text-blue-600 border-b-1 border-dashed hover:underline">
              XLSX
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
