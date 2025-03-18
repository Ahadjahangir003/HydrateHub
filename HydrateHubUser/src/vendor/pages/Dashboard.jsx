import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import {
    Bar,
    CartesianGrid as BarCartesianGrid,
    BarChart,
    Legend as BarLegend,
    Tooltip as BarTooltip,
    XAxis as BarXAxis, YAxis as BarYAxis,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    Tooltip as PieTooltip,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [cpackages, setPackages] = useState([]);
  const [products, setProducts] = useState([]);

  const hasErrorRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const vendorToken = localStorage.getItem("vendorToken");
        const decodedToken = jwtDecode(vendorToken);
        const headers = { Authorization: vendorToken };

        const [packagesRes, ordersRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:3001/package/vendor-packages/${decodedToken.userId}`, { headers }),
          axios.get(`http://localhost:3001/order/vendor-orders/${decodedToken.userId}`, { headers }),
          axios.get(`http://localhost:3001/product/vendor-products/${decodedToken.userId}`, { headers }),
        ]);

        setPackages(packagesRes.data || []);
        setOrders(ordersRes.data || []);
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

  const groupOrdersByDateAndStatus = (orders) => {
    const groupedData = orders.reduce((acc, order) => {
      const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
      if (!acc[orderDate]) {
        acc[orderDate] = { date: orderDate, Completed: 0, Pending: 0 };
      }
      acc[orderDate][order.status] = (acc[orderDate][order.status] || 0) + 1;
      return acc;
    }, {});

    return Object.values(groupedData).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const barChartData = groupOrdersByDateAndStatus(orders);

  const groupOrdersByDate = (orders) => {
    const groupedData = orders.reduce((acc, order) => {
      const orderDate = moment(order.createdAt).format("YYYY-MM-DD");
      const orderTotal = order.quantity ? order.price * order.quantity : order.price;
  
      acc[orderDate] = (acc[orderDate] || 0) + orderTotal;
      return acc;
    }, {});
  
    const allOrderDates = Object.keys(groupedData);
    const minDate = moment.min(allOrderDates.map((date) => moment(date)));
    const maxDate = moment.max(allOrderDates.map((date) => moment(date)));
  
    const startDate = minDate.clone();
    const endDate = maxDate.clone(); // Add one extra day in the future
  
    const filledData = [];
    let currentDate = startDate;
  
    while (currentDate.isSameOrBefore(endDate)) {
      const currentDateStr = currentDate.format("YYYY-MM-DD");
      filledData.push({
        date: currentDateStr,
        total: groupedData[currentDateStr] || 0,
      });
      currentDate = currentDate.add(1, "days");
    }
  
    return filledData;
  };
  
  const lineChartData = groupOrdersByDate(orders);

  const pieChartData1 = [
    { name: "Completed", value: orders.filter((order) => order.status === "Completed").length },
    { name: "Pending", value: orders.filter((order) => order.status === "Pending").length },
  ];

  const pieChartData2 = [
    { name: "Packages", value: cpackages.length },
    { name: "Products", value: products.length },
  ];

  return (
    <div className={`flex h-screen`}>
      <div className={`flex-1 transition-all duration-300`}>
        {/* Navbar */}
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-teal-300 to-blue-900 text-white">
          <h2 className="text-2xl font-bold">Vendor Dashboard</h2>
          <span>{moment().format("MMMM Do YYYY")}</span>
        </div>
        <div className="flex flex-row w-full gap-4 p-6 !text-white">
          <div className="w-3/12 p-4 h-32 bg-green-700 rounded-2xl !text-white text-center"><p className="text-xl text-white font-semibold">Completed Orders</p><p className="text-3xl text-white">{pieChartData1[0].value}</p></div>
          <div className="w-3/12 p-4 h-32 bg-red-700 rounded-2xl !text-white text-center"><p className="text-xl font-semibold text-white">Pending Orders</p><p className="text-3xl text-white">{pieChartData1[1].value}</p></div>
          <div className="w-3/12 p-4 h-32 bg-pink-700 rounded-2xl !text-white text-center"><p className="text-xl font-semibold text-white">My Products</p><p className="text-3xl text-white ">{products.length}</p></div>
          <div className="w-3/12 p-4 h-32 bg-yellow-700 rounded-2xl !text-white text-center"><p className="text-xl font-semibold text-white">My Packages</p><p className="text-3xl text-white">{cpackages.length}</p></div>
        </div>

        {/* Charts Section */}
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Line Chart */}
            <div className="col-span-1 ">
              <h3 className="text-xl font-semibold mb-2 text-center">Sales Data</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={lineChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type='bump' dataKey="total" name="Daily Sales" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Order Status */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Order Status by Day</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <BarCartesianGrid strokeDasharray="3 3" />
                  <BarXAxis dataKey="date" />
                  <BarYAxis />
                  <BarTooltip />
                  <BarLegend />
                  <Bar dataKey="Completed" name='Completed Orders' stackId="a" fill="#36A2EB" />
                  <Bar dataKey="Pending" name='Pending Orders' stackId="a" fill="#FF6384" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Order Status */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Order Status</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData1}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieChartData1.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#36A2EB", "#FF6384"][index % 2]} />
                    ))}
                  </Pie>
                  <PieTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart - Packages and Products */}
            <div className="col-span-1">
              <h3 className="text-xl font-semibold mb-2 text-center">Inventory Stats</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieChartData2}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieChartData2.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={["#FFCE56", "#FF5733"][index % 2]} />
                    ))}
                  </Pie>
                  <PieTooltip />
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
