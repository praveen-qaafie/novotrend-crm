import { useEffect, useRef, useState } from "react";
import { formatNotificationTime } from "../../utils/dateFormat";
import { FiCheck } from "react-icons/fi";

const DropdownWrapperNotification = ({
  trigger,
  notifications,
  onSeeMore,
  markAsRead,
  type,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSeeMore = () => {
    setOpen(false);
    onSeeMore();
  };

  const displayed = notifications?.slice(0, 3) || [];

  return (
    <>
      <div className="relative" ref={ref}>
        <div
          onClick={() => setOpen(!open)}
          className={`flex items-center px-2 py-1.5 text-sm font-medium text-white hover:text-[#e08a09] 
      border-2 border-transparent rounded-md 
      ${
        type === "AccountCard"
          ? "hover:border-gray-800"
          : "hover:border-[#e08a09]"
      } 
      cursor-pointer transition-all`}
        >
          {trigger}
        </div>

        {open && (
          <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#f9fafb] rounded-sm shadow-2xl border-gray-200 overflow-hidden z-50 animate-fadeIn">
            {/* Header */}
            <div className="relative bg-blue-500 px-5 py-3.5 flex items-center justify-between shadow-md">
              <h3 className="text-white text-sm sm:text-base font-semibold tracking-wide flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                Your Notifications
              </h3>
              <span className="text-[11px] sm:text-xs font-medium text-white/90 bg-blue-600 px-2.5 py-[2px] rounded-full backdrop-blur-sm border border-white/20">
                ALL {notifications.length}
              </span>

              <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            </div>

            {/* Notification list */}
            <div className="flex justify-end px-3 py-2 bg-white border-b">
              <button
                onClick={() => markAsRead("all")}
                className="flex items-center gap-1 text-[11px] md:text-xs text-gray-600 hover:text-gray-700 font-medium transition"
              >
                <FiCheck className="w-3.5 h-3.5" />
                Mark all as read
              </button>
            </div>
            <div className="max-h-95 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 bg-gradient-to-b from-white to-gray-50">
              {displayed.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {displayed.map((item) => {
                    const isNew = item.read_status === "0";
                    return (
                      <div
                        key={item.id}
                        onClick={() => markAsRead(item.id)}
                        className={`relative p-3 cursor-pointer transition-all duration-200 
                    ${
                      isNew
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "hover:bg-gray-50"
                    } rounded-lg m-2 shadow-sm hover:shadow-md`}
                      >
                        <p className="text-[13px] text-gray-800 text-left leading-snug">
                          {item.notification}
                        </p>

                        {/* New badge */}
                        {isNew && (
                          <span className="absolute -top-0.5 right-2 inline-block px-2 py-[1px] text-[9px] font-semibold bg-emerald-300 text-green-800 rounded-full animate-pulse">
                            NEW
                          </span>
                        )}

                        {/* Time bottom-right */}
                        <div className="flex justify-end mt-2">
                          <p className="text-[11px] text-gray-500 whitespace-nowrap">
                            {formatNotificationTime(item.date)}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* See More button */}
                  {notifications.length > 3 && (
                    <div className="text-center py-3 bg-gray-50 border-t border-gray-100">
                      <button
                        onClick={handleSeeMore}
                        className="text-blue-600 text-sm font-medium hover:text-blue-700 hover:underline"
                      >
                        View More →
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 text-center text-gray-500 text-sm">
                  No New Notifications found
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DropdownWrapperNotification;
