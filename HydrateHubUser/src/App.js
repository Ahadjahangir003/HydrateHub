import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "./context/SidebarContext";

const App = () => {
  return (
    <AuthProvider>
          <SidebarProvider>
        <ToastContainer position="top-right" autoClose={4000} />
      <AppRoutes />
          </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
