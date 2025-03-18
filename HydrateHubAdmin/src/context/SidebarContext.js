import React, { createContext, useState, useContext } from "react";

// Create the SidebarContext
const SidebarContext = createContext();

// Custom hook to use SidebarContext
export const useSidebar = () => useContext(SidebarContext);

// SidebarProvider to wrap around the app
export const SidebarProvider = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prevState) => !prevState);
  };

  return (
    <SidebarContext.Provider value={{ isSidebarCollapsed, toggleSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
