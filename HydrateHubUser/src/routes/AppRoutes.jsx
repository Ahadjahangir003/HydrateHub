import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Home from "../components/Home";
import Login from "../components/Login";
import SignUp from "../components/SignUp";
import ProductsList from "../components/ProductsList";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/ContactUs";
import Vendors from "../components/Vendors";
import FAQs from "../components/FAQs";
import ProductDetail from "../components/ProductDetail";
import PrivacyPolicy from "../components/PrivacyPolicy";
import TermsnConditions from "../components/TermsnCondition";
import ForgotPassword from "../components/ForgotPass";
import Verification from "../components/Verify";
import ResetPassword from "../components/ResetPass";
import { useSidebar } from "../context/SidebarContext";
import Sidebar from "../vendor/components/Sidebar";

import Dashboard from "../vendor/pages/Dashboard";
import AddPackage from "../vendor/pages/AddPackage";
import AddProducts from "../vendor/pages/AddProducts";
import AllPackages from "../vendor/pages/AllPackages";
import AllProducts from "../vendor/pages/AllProducts";
import UpdatePackage from "../vendor/pages/UpdatePackage";
import UpdateProduct from "../vendor/pages/UpdateProduct";
import PackagesList from "../components/PackageList";
import PackageDetail from "../components/PackageDetail";
import Profile1 from "../vendor/pages/Profile";
import Profile from "../components/Profile";
import ChangePass from "../components/ChangePass";
import ChangePass1 from "../vendor/pages/ChangePass";
import VendorDetail from "../pages/VendorDetail";
import Orders from "../vendor/pages/Orders";
import Finance from "../vendor/pages/Finance";

const AppRoutes = () => {
    const { isAuthenticated, login, logout } = useContext(AuthContext);
    const { isSidebarCollapsed } = useSidebar(); // Using context for sidebar state
    const [loading, setLoading] = useState(true); // Add loading state
    const [isvendor, setIsVendor]=useState(false);

    useEffect(() => {

        const userToken = localStorage.getItem("userToken");
        const vendorToken = localStorage.getItem("vendorToken");
    
        if (userToken) {
            login();
            setIsVendor(false);
        } else if (vendorToken) {
            login();
            setIsVendor(true);
        } else {
            logout();
            setIsVendor(false);
        }
    
        setLoading(false); // Move outside the logic to ensure it is always updated
    }, [login, logout]);
    
    if (loading) {
        // Show a loading spinner or placeholder while checking authentication
        return <div>Loading...</div>;
    }
    const ContentStyle = {
        marginTop: "60px", 
      };
    const MainLayout = ({ children }) => (
        <div style={ContentStyle}>
          <Navbar />
          {children}
          <Footer />  
        </div>
      );
    const VendorLayout = ({ children }) => (
          <>
          <Sidebar />
        <div className={`${isSidebarCollapsed? 'ml-20': 'ml-64'}`}>
          {children}  
        </div>
          </>
      );
    return (
        <Router>
            <Routes>
                <Route path="/forgot-password" element={isAuthenticated? isvendor? <Navigate to="/vendor-dashboard"/> :<Navigate to="/"/> : <ForgotPassword />} />
                <Route path="/verify" element={isAuthenticated? isvendor? <Navigate to="/vendor-dashboard"/> :<Navigate to="/"/> :  <Verification />} />
                <Route path="/reset-password" element={isAuthenticated? isvendor? <Navigate to="/vendor-dashboard"/> :<Navigate to="/"/> :  <ResetPassword />} />
                <Route path="/signup" element={isAuthenticated? isvendor? <Navigate to="/vendor-dashboard"/> :<Navigate to="/"/> :  <SignUp />} />
                <Route path="/login" element={isAuthenticated ? isvendor? <Navigate to="/vendor-dashboard"/> :<Navigate to="/"/> : <Login />}/>

                <Route path="/" element={<MainLayout><Home /></MainLayout>}/>
                <Route path="/user-profile" element={!isvendor? !isAuthenticated? <Navigate to="/"/> : <MainLayout><Profile /></MainLayout> : <Navigate to="/login"/>}/>
                <Route path="/change-password" element={!isvendor? !isAuthenticated? <Navigate to="/"/> : <MainLayout><ChangePass /></MainLayout> : <Navigate to="/login"/>}/>
                <Route path="/about" element={<MainLayout><AboutUs /></MainLayout>}/>
                <Route path="/vendors" element={<MainLayout><Vendors /></MainLayout>}/>
                <Route path="/contact" element={<MainLayout><ContactUs /></MainLayout>}/>
                <Route path="/faq" element={<MainLayout><FAQs /></MainLayout>}/>
                <Route path="/privacypolicy" element={<MainLayout><PrivacyPolicy /></MainLayout>}/>
                <Route path="/terms" element={<MainLayout><TermsnConditions /></MainLayout>}/>
                <Route path="/plist" element={<MainLayout><ProductsList /></MainLayout>} />
                <Route path="/product/:id" element={<MainLayout><ProductDetail /></MainLayout>}/>
                <Route path="/packagelist" element={<MainLayout><PackagesList /></MainLayout>} />
                <Route path="/package/:id" element={<MainLayout><PackageDetail /></MainLayout>}/>
                <Route path="/vendor-detail/:id" element={<MainLayout><VendorDetail /></MainLayout>}/>
                <Route path="*" element={<Navigate to="/login" />} />

                <Route path="/vendor-dashboard" element={isAuthenticated ? <VendorLayout><Dashboard /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/add-product" element={isAuthenticated ? <VendorLayout><AddProducts /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/add-package" element={isAuthenticated ? <VendorLayout><AddPackage /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/all-products" element={isAuthenticated ? <VendorLayout><AllProducts /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/edit-product/:id" element={isAuthenticated ? <VendorLayout><UpdateProduct /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/edit-package/:id" element={isAuthenticated ? <VendorLayout><UpdatePackage /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/all-packages" element={isAuthenticated ? <VendorLayout><AllPackages /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/vendor-profile" element={isAuthenticated ? <VendorLayout><Profile1 /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/change-password-vendor" element={isAuthenticated ? <VendorLayout><ChangePass1 /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/orders" element={isAuthenticated ? <VendorLayout><Orders /></VendorLayout> : <Navigate to="/login" />}/>
                <Route path="/finance" element={isAuthenticated ? <VendorLayout><Finance /></VendorLayout> : <Navigate to="/login" />}/>

            </Routes>
        </Router>
    );
};

export default AppRoutes;
