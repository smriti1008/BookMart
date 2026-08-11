// src/components/Profile/UserOrderHistory.jsx
import React, { useEffect, useState } from "react";
import api from "../../util/axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearing, setClearing] = useState(false);
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    fetchOrders();
    
    // Check if redirected from payment or order placement
    if (location.state?.fromPayment || location.state?.fromOrder) {
      setShowSuccessMessage(true);
      // Clear the state after showing message
      setTimeout(() => setShowSuccessMessage(false), 5000);
      
      // Clear the navigation state to prevent showing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = () => {
      fetchOrders();
    };

    // Listen for custom order update events
    window.addEventListener('orderUpdated', handleOrderUpdate);
    
    // Auto-refresh every 30 seconds to catch any updates
    const refreshInterval = setInterval(fetchOrders, 30000);
    
    return () => {
      window.removeEventListener('orderUpdated', handleOrderUpdate);
      clearInterval(refreshInterval);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      const response = await api.get(`/orders`);
      
      // Ensure we have valid data
      const ordersData = response.data?.orders || [];
      
      // Filter out any invalid orders
      const validOrders = ordersData.filter(order => order && order._id);
      
      setOrders(validOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      
      // Better error messages based on error type
      if (error.response?.status === 401) {
        setError("Please login to view your order history");
      } else if (error.response?.status === 500) {
        setError("Server error. Please try again later.");
      } else if (!navigator.onLine) {
        setError("No internet connection. Please check your network.");
      } else {
        setError(error.response?.data?.message || "Failed to load order history");
      }
    } finally {
      setLoading(false);
    }
  };

  const clearOrderHistory = async () => {
    if (!window.confirm("Are you sure you want to clear your entire order history? This action cannot be undone.")) {
      return;
    }

    try {
      setClearing(true);
      await api.delete(`/clear-history`);
      
      setOrders([]);
      toast.success("Order history cleared successfully!");
    } catch (error) {
      console.error("Error clearing order history:", error);
      toast.error("Failed to clear order history");
    } finally {
      setClearing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "order placed":
        return "bg-blue-500";
      case "out for delivery":
        return "bg-yellow-500";
      case "delivered":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "order placed":
        return "📦";
      case "out for delivery":
        return "🚚";
      case "delivered":
        return "✅";
      case "cancelled":
        return "❌";
      default:
        return "📋";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 2592000) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
      return formatDate(dateString);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading order history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700">
        <div className="text-7xl mb-6">⚠️</div>
        <h3 className="text-3xl font-bold text-gray-300 mb-3">Error Loading Orders</h3>
        <p className="text-gray-400 text-lg mb-8">{error}</p>
        <button 
          onClick={fetchOrders}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-20 bg-zinc-800/50 rounded-2xl backdrop-blur-sm border border-zinc-700">
        <div className="text-7xl mb-6">📋</div>
        <h3 className="text-3xl font-bold text-gray-300 mb-3">No Orders Yet</h3>
        <p className="text-gray-400 text-lg mb-8">You haven't placed any orders yet. Start shopping to see your order history here!</p>
        <a 
          href="/all-books"
          className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Browse Books
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-green-900/50 border border-green-500 text-green-300 px-6 py-4 rounded-xl flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg">Order Placed Successfully!</h3>
            <p className="text-sm text-green-400">Your order has been placed and added to your order history. A confirmation email has been sent.</p>
          </div>
          <button 
            onClick={() => setShowSuccessMessage(false)}
            className="ml-auto text-green-300 hover:text-white text-2xl hover:bg-green-500/20 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-bold text-white flex items-center">
          <span className="mr-3 text-4xl">📋</span> Order History
        </h2>
        <div className="flex gap-3">
          <button 
            onClick={fetchOrders}
            disabled={loading}
            className="bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Refreshing...</span>
              </>
            ) : (
              <>
                <span className="text-lg">🔄</span> Refresh
              </>
            )}
          </button>
          {orders.length > 0 && (
            <button 
              onClick={clearOrderHistory}
              disabled={clearing}
              className="bg-transparent border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white disabled:bg-gray-600 disabled:border-gray-600 disabled:text-gray-400 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 disabled:cursor-not-allowed"
            >
              {clearing ? (
                <>
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Clearing...</span>
                </>
              ) : (
                <>
                  <span className="text-lg">🗑️</span> Clear History
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const isRecent = new Date() - new Date(order.createdAt) < 3600000; // Within last hour
          return (
            <div key={order._id} className={`bg-zinc-800/50 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border ${isRecent ? 'border-green-500/50' : 'border-zinc-700'} hover:border-zinc-600 ${isRecent ? 'ring-1 ring-green-500/20' : ''}`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-bold text-white">
                    Order #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  {isRecent && (
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      NEW
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-gray-400 text-sm">
                    <span className="font-medium">Ordered:</span> {formatDate(order.createdAt)}
                  </p>
                  <p className="text-gray-500 text-xs" title={formatFullDate(order.createdAt)}>
                    <span className="font-medium">Full date:</span> {formatFullDate(order.createdAt)}
                  </p>
                  <p className="text-blue-400 text-xs">
                    <span className="font-medium">Time ago:</span> {formatTimeAgo(order.createdAt)}
                  </p>
                  <p className="text-gray-400 text-sm">
                    <span className="font-medium">Items:</span> {order.books?.length || 0} book{(order.books?.length || 0) !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-400">₹{order.totalAmount}</p>
                  <p className="text-sm text-gray-400">Total Amount</p>
                </div>
                
                <div className={`px-4 py-2 rounded-full text-white font-semibold flex items-center gap-2 ${getStatusColor(order.status)}`}>
                  <span>{getStatusIcon(order.status)}</span>
                  <span className="capitalize">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-3">
              <h4 className="text-lg font-semibold text-gray-300 mb-3">Order Items:</h4>
              {order.books && order.books.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.books.map((orderItem, index) => {
                    const book = orderItem?.book || orderItem; // Handle both old and new structure
                    
                    // Skip if book data is not available
                    if (!book || !book.title) {
                      return (
                        <div key={index} className="flex items-center gap-3 p-3 bg-zinc-700/50 rounded-lg">
                          <div className="w-12 h-16 bg-zinc-600 flex items-center justify-center text-gray-400 rounded text-xs">
                            📚
                          </div>
                          <div className="flex-grow min-w-0">
                            <h5 className="font-semibold text-gray-400 text-sm">Book details unavailable</h5>
                            <p className="text-blue-400 text-xs mt-1">Qty: {orderItem?.qty || 1}</p>
                          </div>
                        </div>
                      );
                    }
                    
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 bg-zinc-700/50 rounded-lg">
                        {book.url ? (
                          <img 
                            src={book.url} 
                            alt={book.title || "Book"} 
                            className="w-12 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-16 bg-zinc-600 items-center justify-center text-gray-400 rounded text-xs ${book.url ? 'hidden' : 'flex'}`}>
                          📚
                        </div>
                        <div className="flex-grow min-w-0">
                          <h5 className="font-semibold text-white text-sm truncate">{book.title || "Unknown Book"}</h5>
                          <p className="text-gray-400 text-xs">by {book.author || "Unknown Author"}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-green-400 font-semibold text-sm">₹{book.price || 0}</p>
                            <p className="text-blue-400 text-xs">Qty: {orderItem?.qty || 1}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-400 italic">No book details available</p>
              )}
            </div>

            {/* Order Actions */}
            <div className="flex flex-wrap gap-3 mt-6 pt-4 border-t border-zinc-600">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2">
                <span>👁️</span> View Details
              </button>
              {order.status === "delivered" && (
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2">
                  <span>⭐</span> Rate Order
                </button>
              )}
              {order.status === "order placed" && (
                <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2">
                  <span>❌</span> Cancel Order
                </button>
              )}
              <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2">
                <span>🔄</span> Reorder
              </button>
            </div>
          </div>
          );
        })}
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">Total Orders</p>
              <p className="text-3xl font-bold">{orders.length}</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Total Spent</p>
              <p className="text-3xl font-bold">₹{orders.reduce((sum, order) => sum + order.totalAmount, 0)}</p>
            </div>
            <span className="text-4xl">💰</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm">Books Purchased</p>
              <p className="text-3xl font-bold">{orders.reduce((sum, order) => sum + (order.books?.length || 0), 0)}</p>
            </div>
            <span className="text-4xl">📚</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserOrderHistory;