import { useContext } from "react";
import { ActiveUserContext } from "./ActiveUserContext";

export const useUserContext = () => {
  const context = useContext(ActiveUserContext);

  if (!context) {
    throw new Error("useUserContext must be used within ActiveUserProvider");
  }

  return context;
};