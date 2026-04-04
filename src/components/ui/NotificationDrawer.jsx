import { IoClose } from "react-icons/io5";
import { formatNotificationTime } from "../../utils/dateFormat";
import { IoNotificationsSharp } from "react-icons/io5";

const NotificationDrawer = ({ open, onClose, notifications, markAsRead }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        open
          ? "visible bg-black/40 backdrop-blur-[2px]"
          : "invisible bg-transparent"
      }`}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute top-0 right-0 h-full w-80 sm:w-96 bg-gradient-to-b from-white to-gray-50 shadow-[0_0_20px_rgba(0,0,0,0.2)]  border-gray-200 transform transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        } overflow-hidden`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-blue-500 flex items-center justify-between px-4 py-3 shadow-md">
          <div className="flex items-center gap-2">
            <IoNotificationsSharp className="w-5 h-5 text-white" />
            <h2 className="text-base sm:text-lg font-semibold text-white">
              Notifications
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition"
          >
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto max-h-[calc(100vh-4rem)] p-3 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {notifications.length > 0 ? (
            notifications.map((item) => {
              const isNew = item.read_status === "0";
              return (
                <div
                  key={item.id}
                  onClick={() => markAsRead(item.id)}
                  className={`relative p-3 mb-3 rounded-xl cursor-pointer shadow-sm hover:shadow-md transition-all border border-gray-100 ${
                    isNew
                      ? "bg-blue-50 hover:bg-blue-100"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  {/* Notification text */}
                  <p className="text-[13px] sm:text-sm text-gray-800 text-left leading-snug">
                    {item.notification}
                  </p>

                  {/* NEW badge */}
                  {isNew && (
                    <span className="absolute -top-0.5 right-2 inline-block px-2 py-[0.5px] text-[10px] font-semibold bg-emerald-300 text-green-800 rounded-full shadow-sm animate-pulse">
                      NEW
                    </span>
                  )}

                  {/* Time (bottom-right) */}
                  <div className="flex justify-end mt-2">
                    <p className="text-[11px] text-gray-500 whitespace-nowrap">
                      {formatNotificationTime(item.date)}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              No Notifications Available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
