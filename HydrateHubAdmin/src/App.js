import React from "react";
import AppRoutes from "./routes/AppRoute";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import { SidebarProvider } from "./context/SidebarContext";  // Import the sidebar context

const App = () => {
  return (
    <AuthProvider>
          <SidebarProvider>
        <ToastContainer position="top-right" autoClose={3000} />
      <AppRoutes />
          </SidebarProvider>
    </AuthProvider>
  );
};

export default App;
