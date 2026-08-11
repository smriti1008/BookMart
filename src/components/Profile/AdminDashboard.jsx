// src/components/Profile/AdminDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../util/axios";
import { Link } from "react-router-dom";
import { 
  Package, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  DollarSign,
  ShoppingBag,
  BarChart3,
  RefreshCw,
  Eye,
  ArrowUpRight
} from "lucide-react";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalBooks: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    outForDelivery: 0,
    cancelledOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all orders
      const ordersRes = await api.get(`/get-all-history`);
      const orders = ordersRes.data.data || [];
      
      // Fetch all books
      const booksRes = await api.get(`/get-all-books`);
      const books = booksRes.data.data || [];
      
      // Calculate stats
      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const pendingOrders = orders.filter(o => o.status === "order placed").length;
      const deliveredOrders = orders.filter(o => o.status === "delivered").length;
      const outForDelivery = orders.filter(o => o.status === "out for delivery").length;
      const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
      
      setStats({
        totalOrders: orders.length,
        totalRevenue,
        totalBooks: books.length,
        pendingOrders,
        deliveredOrders,
        outForDelivery,
        cancelledOrders
      });
      
      // Get recent 5 orders
      setRecentOrders(orders.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "order placed": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "out for delivery": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "delivered": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "order placed": return <Clock className="w-4 h-4" />;
      case "out for delivery": return <Truck className="w-4 h-4" />;
      case "delivered": return <CheckCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-400" />
            Admin Dashboard
          </h2>
          <p className="text-zinc-400 mt-1">Overview of your bookstore</p>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all duration-300"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-5 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">₹{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>From {stats.totalOrders} orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl p-5 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.totalOrders}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-blue-400 text-sm">
            <Package className="w-4 h-4" />
            <span>{stats.pendingOrders} pending</span>
          </div>
        </div>

        {/* Total Books */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-5 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">Total Books</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.totalBooks}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <Link to="/profile/admin/add-book" className="flex items-center gap-1 mt-3 text-purple-400 text-sm hover:text-purple-300 transition-colors">
            <span>Add new book</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Delivered Orders */}
        <div className="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 rounded-xl p-5 border border-yellow-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 text-sm font-medium">Delivered</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.deliveredOrders}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-3 text-yellow-400 text-sm">
            <Truck className="w-4 h-4" />
            <span>{stats.outForDelivery} out for delivery</span>
          </div>
        </div>
      </div>

      {/* Order Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Breakdown */}
        <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Order Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-zinc-300">Pending</span>
              </div>
              <span className="text-xl font-bold text-blue-400">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-yellow-400" />
                <span className="text-zinc-300">Out for Delivery</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">{stats.outForDelivery}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-zinc-300">Delivered</span>
              </div>
              <span className="text-xl font-bold text-green-400">{stats.deliveredOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-400" />
                <span className="text-zinc-300">Cancelled</span>
              </div>
              <span className="text-xl font-bold text-red-400">{stats.cancelledOrders}</span>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Recent Orders
            </h3>
            <Link 
              to="/profile/admin/orders" 
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-4 bg-zinc-700/30 rounded-lg hover:bg-zinc-700/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-zinc-600 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-zinc-400 text-xs">
                        {order.user?.username || "Unknown"} • {order.books?.length || 0} items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">₹{order.totalAmount}</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
        <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            to="/profile/admin/add-book"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Add Book</p>
              <p className="text-zinc-400 text-xs">Add new book to catalog</p>
            </div>
          </Link>
          
          <Link 
            to="/profile/admin/orders"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <Package className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-medium">Manage Orders</p>
              <p className="text-zinc-400 text-xs">View and update orders</p>
            </div>
          </Link>
          
          <Link 
            to="/all-books"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <Eye className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white font-medium">View Catalog</p>
              <p className="text-zinc-400 text-xs">Browse all books</p>
            </div>
          </Link>
          
          <Link 
            to="/profile/settings"
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-600/20 to-yellow-700/20 rounded-xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all group"
          >
            <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/30 transition-colors">
              <Users className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white font-medium">Settings</p>
              <p className="text-zinc-400 text-xs">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
