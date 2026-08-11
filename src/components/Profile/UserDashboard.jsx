// src/components/Profile/UserDashboard.jsx
import { useEffect, useState } from "react";
import api from "../../util/axios";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { 
  Package, 
  BookOpen, 
  Heart,
  Clock, 
  CheckCircle, 
  Truck, 
  XCircle,
  ShoppingBag,
  RefreshCw,
  ArrowUpRight,
  Star,
  TrendingUp
} from "lucide-react";
import { toast } from "react-toastify";

const UserDashboard = () => {
  const user = useSelector((state) => state.auth.user);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    booksPurchased: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    favouritesCount: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's orders
      const ordersRes = await api.get(`/orders`);
      const orders = ordersRes.data.orders || [];
      
      // Fetch favourites
      const favRes = await api.get(`/get-favourite-books`);
      const favourites = favRes.data.data || [];
      
      // Calculate stats
      const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
      const booksPurchased = orders.reduce((sum, order) => sum + (order.books?.length || 0), 0);
      const pendingOrders = orders.filter(o => o.status === "order placed" || o.status === "out for delivery").length;
      const deliveredOrders = orders.filter(o => o.status === "delivered").length;
      
      setStats({
        totalOrders: orders.length,
        totalSpent,
        booksPurchased,
        pendingOrders,
        deliveredOrders,
        favouritesCount: favourites.length
      });
      
      // Get recent 3 orders
      setRecentOrders(orders.slice(0, 3));
      
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
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-2xl p-6 border border-zinc-700/50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Welcome back, <span className="text-yellow-400">{user?.username || "Reader"}</span>! 👋
            </h2>
            <p className="text-zinc-400 mt-1">Here's what's happening with your account</p>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-all duration-300"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-xl p-4 sm:p-5 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-xs sm:text-sm font-medium">Total Orders</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.totalOrders}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            </div>
          </div>
        </div>

        {/* Total Spent */}
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-xl p-4 sm:p-5 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-xs sm:text-sm font-medium">Total Spent</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">₹{stats.totalSpent.toLocaleString()}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
          </div>
        </div>

        {/* Books Purchased */}
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-xl p-4 sm:p-5 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-xs sm:text-sm font-medium">Books Bought</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.booksPurchased}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Favourites */}
        <div className="bg-gradient-to-br from-pink-600/20 to-rose-600/20 rounded-xl p-4 sm:p-5 border border-pink-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-400 text-xs sm:text-sm font-medium">Favourites</p>
              <p className="text-2xl sm:text-3xl font-bold text-white mt-1">{stats.favouritesCount}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-500/20 rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Order Status + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Status Summary */}
        <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            Order Status
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-400" />
                <span className="text-zinc-300 text-sm">In Progress</span>
              </div>
              <span className="text-xl font-bold text-yellow-400">{stats.pendingOrders}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-zinc-300 text-sm">Delivered</span>
              </div>
              <span className="text-xl font-bold text-green-400">{stats.deliveredOrders}</span>
            </div>
          </div>
          
          <Link 
            to="/profile/orderHistory" 
            className="mt-4 flex items-center justify-center gap-2 w-full py-2 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm"
          >
            View All Orders
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-400" />
              Recent Orders
            </h3>
            <Link 
              to="/profile/orderHistory" 
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
            >
              View All
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
              <p className="text-zinc-400 mb-4">No orders yet</p>
              <Link 
                to="/all-books"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
              >
                <BookOpen className="w-4 h-4" />
                Browse Books
              </Link>
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
                        {order.books?.length || 0} items • {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-400 font-semibold">₹{order.totalAmount}</p>
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize hidden sm:inline">{order.status}</span>
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
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link 
            to="/all-books"
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-blue-600/20 to-blue-700/20 rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-white font-medium text-sm">Browse Books</p>
          </Link>
          
          <Link 
            to="/profile/favourites"
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-pink-600/20 to-pink-700/20 rounded-xl border border-pink-500/30 hover:border-pink-500/50 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-pink-500/20 rounded-xl flex items-center justify-center group-hover:bg-pink-500/30 transition-colors">
              <Heart className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-white font-medium text-sm">Favourites</p>
          </Link>
          
          <Link 
            to="/cart"
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-green-600/20 to-green-700/20 rounded-xl border border-green-500/30 hover:border-green-500/50 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
              <ShoppingBag className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-white font-medium text-sm">My Cart</p>
          </Link>
          
          <Link 
            to="/profile/settings"
            className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all group text-center"
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
              <Star className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-white font-medium text-sm">Settings</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
