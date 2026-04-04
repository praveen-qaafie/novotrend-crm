import { useEffect, useRef, useState } from "react";

const DropdownWrapper = ({ trigger, children, type }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const handleClickOutside = (e) => {
    if (ref.current && !ref.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <div
        onClick={() => setOpen(!open)}
        className={`
            flex items-center px-2 py-1.5 text-sm font-medium text-white hover:text-[#e08a09] 
            border-2 border-transparent rounded-md 
            ${
              type === "AccountCard"
                ? "hover:border-gray-800"
                : "hover:border-[#e08a09]"
            } 
            cursor-pointer transition-all `}
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

export default DropdownWrapper;
