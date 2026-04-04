import { useEffect, useRef } from "react";

const DropdownCustomOpen = ({ open, onOpenChange, trigger, children }) => {
  const ref = useRef();

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onOpenChange(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => onOpenChange(!open)}
        className="flex items-center px-2 py-1.5 text-sm font-medium text-white hover:text-[#e08a09] border-2 border-transparent rounded-md hover:border-gray-800 cursor-pointer transition-all"
      >
        {trigger}
      </div>
      {open && (
        <div className="absolute right-0 mt-2 w-auto bg-white border shadow-md rounded-md z-50 p-3">
          {children}
        </div>
      )}
    </div>
  );
};

export default DropdownCustomOpen;
