import "./App.css";
import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { SidebarProvider } from "./context/SidebarContext";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import useLogoutHandler from "./hooks/useLogout";

function App() {
  useLogoutHandler(); // Top-Level
  const { pathname } = useLocation();
 

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" }); // or 'auto' for instant scroll
  }, [pathname]);

  return (
    <div className="App">
      <SidebarProvider>
        <Outlet />
      </SidebarProvider>
    </div>
  );
}

export default App;