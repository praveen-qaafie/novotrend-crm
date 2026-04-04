export default function Contact() {
  const supportLanguages = [
    {
      language: "English",
      availability: "Available now",
      hours: "Mon 10:00 AM – Friday 06:30 PM",
    },
    // {
    //   language: "Hindi",
    //   availability: "Available now",
    //   hours: "Mon 10:00 AM – Friday 06:30 PM",
    // },
  ];

  return (
    <div className=" bg-gray-50">
      {/* Header Section */}
      <div className="px-6 py-8 border-b border-gray-200 bg-white shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Support</h1>
          <a
            href="mailto:support@novotrend.co"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-xl bg-white text-gray-700 shadow-sm hover:bg-gray-100 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
              <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0v-1.5a9 9 0 1 0 -5.5 8.28"></path>
            </svg>
            <span className="font-medium">Send email</span>
          </a>
        </div>
      </div>

      {/* Support Languages Section */}
      <div className="px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-3 gap-6 px-4 py-3 bg-gray-200 rounded-lg text-sm font-semibold text-gray-700">
            <div>Language</div>
            <div>Accessibility</div>
            <div>Your Local time</div>
          </div>

          {/* Support Languages List */}
          <div className="mt-4 space-y-4">
            {supportLanguages.map((item, index) => (
              <div
                key={index}
                className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6 bg-white p-5 rounded-xl shadow hover:shadow-md transition-all"
              >
                <div className="font-medium text-gray-900">{item.language}</div>
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    {item.availability}
                  </span>
                </div>
                <div className="text-gray-600 text-sm">{item.hours}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
