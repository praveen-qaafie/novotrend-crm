import { useState, useEffect, createContext, useContext, useRef } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [toggle, setToggle] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setToggle(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Click away handler
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", checkMobile);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <SidebarContext.Provider
      value={{ toggle, setToggle, isMobile, sidebarRef }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => useContext(SidebarContext);
