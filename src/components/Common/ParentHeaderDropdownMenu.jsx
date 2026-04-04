import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
/**
 * HeaderDropdownMenu
 * Props:
 * - icon: ReactNode (icon for the menu)
 * - label: string (menu label)
 * - items: array of { label: string, badge?: string, onClick?: function, path?: string }
 * - currentPath: string (current location path)
 * - active: boolean (if the menu is active)
 * - onOpenChange?: function (optional, called when open state changes)
 */
const ParentHeaderDropdownMenu = ({
  icon,
  label,
  items = [],
  currentPath,
  active = false,
  onOpenChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Determine if any item matches currentPath
  const isActive =
    active ||
    (currentPath &&
      items.some((item) => item.path && item.path === currentPath));

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
        if (onOpenChange) onOpenChange(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  // Sync with parent if needed
  useEffect(() => {
    if (onOpenChange) onOpenChange(open);
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={ref}>
      <div
        className={`flex items-center gap-1 text-sm px-2 py-1 rounded cursor-pointer transition-colors select-none ${
          open || isActive
            ? "bg-blue-100 border border-blue-500 text-blue-700 font-bold"
            : "text-gray-600 hover:text-black border border-transparent"
        }`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="text-base">{icon}</span>
        <span>{label}</span>
        <svg
          className={`w-3 h-3 mt-[1px] transition-transform ${open ? "rotate-180" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.184l3.71-3.955a.75.75 0 111.08 1.04l-4.25 4.535a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
        </svg>
      </div>
      {open && (
        <div className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-lg z-50 py-2">
          {items.map((item, idx) => (
            <div
              key={item.label + idx}
              className={`px-4 py-2 hover:bg-gray-100 flex justify-between items-center cursor-pointer ${item.path === currentPath ? "bg-blue-100 text-blue-700 font-bold" : ""}`}
              onClick={() => {
                if (item.onClick) item.onClick();
                setOpen(false);
                if (onOpenChange) onOpenChange(false);
              }}
            >
              <Link to={item.path} className="w-full">
                {" "}
                {item.label}
              </Link>
              {/* {item.badge && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ParentHeaderDropdownMenu;
