import { useEffect, useRef, useState } from "react";

const DropdownWrapperPartner = ({ trigger, children }) => {
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
        className="
            flex items-center px-2 py-1.5 text-sm font-medium text-white 
            hover:bg-blue-500 border-2 border-transparent rounded-md 
            hover:border-white cursor-pointer transition-all "
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

export default DropdownWrapperPartner;
