import axios from "axios";
import moment from "moment"; // For displaying current date
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSidebar } from "../context/SidebarContext";

const Dashboard = () => {
  const { isSidebarCollapsed } = useSidebar(); // Using context for sidebar state
  const [orders, setOrders] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [cpackages, setPackages] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const hasErrorRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        const headers = { Authorization: adminToken };

        const [packagesRes, vendorsRes, ordersRes, usersRes, productsRes] = await Promise.all([
          axios.get("http://localhost:3001/package/all-packages", { headers }),
          axios.get("http://localhost:3001/admin/partners", { headers }),
          axios.get("http://localhost:3001/order/all-orders", { headers }),
          axios.get("http://localhost:3001/admin/users", { headers }),
          axios.get("http://localhost:3001/admin/products", { headers }),
        ]);

        setPackages(packagesRes.data || []);
        setVendors(vendorsRes.data || []);
        setOrders(ordersRes.data || []);
        setUsers(usersRes.data || []);
        setProducts(productsRes.data || []);
        hasErrorRef.current = false;
      } catch (error) {
        console.error("Error fetching data:", error);
        if (!hasErrorRef.current) {
          toast.error("Failed to fetch data!");
          hasErrorRef.current = true;
        }
      }
    };

    fetchData();
  }, []);

  // Dynamic Line Chart Data (User Growth)
  const lineChartData = users.reduce((acc, user) => {
    const month = moment(user.createdAt).format("MMM"); // Extract month
    const existing = acc.find((item) => item.name === month);
    if (existing) {
      existing.users += 1;
    } else {
      acc.push({ name: month, users: 1 });
    }
    return acc;
  }, []);

  // Dynamic Bar Chart Data (Orders by Vendor and Status)
  const barChartData = vendors.map((vendor) => {
    const vendorOrders = orders.filter((order) => order.vendorId === vendor._id);
    return {
      vendor: vendor.companyName,
      completed: vendorOrders.filter((order) => order.status === "Completed").length,
      pending: vendorOrders.filter((order) => order.status === "Pending").length,
    };
  });

  // Dynamic Pie Chart Data (Products by Vendor)
  const pieChartData = vendors.map((vendor) => {
    const vendorProducts = products.filter((product) => product.vendorId === vendor._id).length;
    return { name: vendor.companyName, value: vendorProducts };
  });

  // Dynamic Pie Chart Data (Packages)
  const packagePieData = vendors.map((vendor) => {
    const vendorPackages = cpackages.filter((pkg) => pkg.vendorId === vendor._id).length;
    return { name: vendor.companyName, value: vendorPackages };
  });


  const vendorSalesData = vendors.map((vendor) => {
    const vendorOrders = orders.filter((order) => order.vendorId === vendor._id);
    const totalSales = vendorOrders.reduce((acc, order) => {
      const orderTotal = order.quantity ? order.price * order.quantity : order.price;
      return acc + orderTotal;
    }, 0);
    return {
      vendor: vendor.companyName,
      sales: totalSales,
    };
  });


  // Get current date
  const currentDate = moment().format("MMMM Do YYYY");

  return (
    <div className={`flex ${isSidebarCollapsed ? "ml-20" : "ml-64"} h-screen`}>
      <div className="flex-1 transition-all duration-300">
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-indigo-300 to-blue-900 text-white">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <span>{currentDate}</span>
        </div>
        <div className="flex flex-row w-full gap-4 p-6">
          <div className="w-3/12 p-4 h-32 bg-teal-700 rounded-2xl text-white text-center"><p className="text-xl font-semibold">Registered Users</p><p className="text-3xl">{users.length}</p></div>
          <div className="w-3/12 p-4 h-32 bg-indigo-700 rounded-2xl text-white text-center"><p className="text-xl font-semibold">Registered Vendors</p><p className="text-3xl">{vendors.length}</p></div>
          <div className="w-3/12 p-4 h-32 bg-sky-700 rounded-2xl text-white text-center"><p className="text-xl font-semibold">Total Products</p><p className="text-3xl">{products.length}</p></div>
          <div className="w-3/12 p-4 h-32 bg-blue-700 rounded-2xl text-white text-center"><p className="text-xl font-semibold">Total Packages</p><p className="text-3xl">{cpackages.length}</p></div>
        </div>
        {/* Charts Section */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">User Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type='bump' dataKey="users" name="New User By Month" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Vendor Total Sales</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendorSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendor" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#82ca9d" name='Vendor Sales' />
                  <LabelList dataKey="vendor" position="top" style={{ fill: "#555", fontSize: "12px" }} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Total Orders by Vendor</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vendor" className="text-sm" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" fill="#82ca9d" name="Completed Orders" />
                  <Bar dataKey="pending" fill="#8884d8" name="Pending Orders" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart (Products) */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Products by Vendor</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={pieChartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={({ name }) => name} // Display the name outside
                    labelLine={true}
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#FF6384", "#36A2EB", "#FFCE56", "#FF5733"][index % 4]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart (Packages) */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Packages by Vendor</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={packagePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    fill="#8884d8"
                    label={({ name }) => name} // Display the name outside
                    labelLine={true}
                  >
                    {packagePieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={["#FF6384", "#36A2EB", "#FFCE56", "#FF5733"][index % 4]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
