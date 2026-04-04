import { Link, useLocation } from "react-router-dom";

export default function RebateNav() {
  const location = useLocation();

  const tabs = [
    // {
    //   id: "approval-list",
    //   label: "Approval list",
    //   path: "/partner/rebates/",
    //   dataAuto: "approve_tab"
    // },
    {
      id: "clients",
      label: "Clients",
      path: "/partner/rebates/clients",
      dataAuto: "clients_tab"
    },
    // {
    //   id: "groups",
    //   label: "Groups",
    //   path: "/partner/rebates/groups",
    //   dataAuto: "groups_tab"
    // },
    {
      id: "history",
      label: "History",
      path: "/partner/rebates/history",
      dataAuto: "history_tab"
    }
  ];

  const getActiveTab = () => {
    const currentPath = location.pathname;
    const activeTab = tabs.find(tab => tab.path === currentPath);
    return activeTab ? activeTab.id : "clients";
  };

  return (
      <div className="">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Rebates</h1>
        </div>
        {/* Navigation Tabs */}
        <div className="relative py-2 mb-3">
          <div className="flex">
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                to={tab.path}
                data-auto={tab.dataAuto}
                className={`
                  relative px-4 py-3 text-md font-medium transition-colors duration-200
                  ${getActiveTab() === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                  }
                `}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
  );
}
