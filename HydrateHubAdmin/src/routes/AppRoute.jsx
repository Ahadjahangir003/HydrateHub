import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Dashboard from "../pages/Dashboard";
import CreateVendor from "../pages/CreateVendor";
import VendorList from "../pages/VendorList";
import UserList from "../pages/UserList";
import Login from "../pages/Login";
import { AuthContext } from "../context/AuthContext";
import ProductList from "../pages/ProductList";
import PackageList from "../pages/PackageList";
import Orders from "../pages/Orders";

const AppRoutes = () => {
  const { isAuthenticated, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      login();
    }
    setLoading(false); // Mark loading as complete
  }, [login]);

  if (loading) {
    // Show a loading spinner or placeholder while checking authentication
    return <div>Loading...</div>;
  }

  return (
    <Router>
      {isAuthenticated && <Sidebar />}
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/create-vendor"
          element={isAuthenticated ? <CreateVendor /> : <Navigate to="/login" />}
        />
        <Route
          path="/vendor-list"
          element={isAuthenticated ? <VendorList /> : <Navigate to="/login" />}
        />
        <Route
          path="/user-list"
          element={isAuthenticated ? <UserList /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <ProductList /> : <Navigate to="/login" />}
        />
        <Route
          path="/packages"
          element={isAuthenticated ? <PackageList /> : <Navigate to="/login" />}
        />
        <Route
          path="/orders"
          element={isAuthenticated ? <Orders /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
