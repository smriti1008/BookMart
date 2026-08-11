import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, Clock, Settings, LogOut, Camera, Upload, LayoutDashboard, Package, BookPlus } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../../store/auth";
import api from "../../util/axios";
import { clearAuthStorage } from "../../util/storage";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  // User menu items
  const userMenuItems = [
    {
      path: "/profile",
      label: "Dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      path: "/profile/favourites",
      label: "Favourites",
      icon: Heart,
      gradient: "from-pink-600 to-rose-600",
    },
    {
      path: "/profile/orderHistory",
      label: "Order History",
      icon: Clock,
      gradient: "from-amber-600 to-orange-600",
    },
    {
      path: "/profile/settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-purple-600 to-violet-600",
    },
  ];

  // Admin menu items
  const adminMenuItems = [
    {
      path: "/profile",
      label: "Dashboard",
      icon: LayoutDashboard,
      gradient: "from-blue-600 to-indigo-600",
    },
    {
      path: "/profile/admin/orders",
      label: "All Orders",
      icon: Package,
      gradient: "from-amber-600 to-orange-600",
    },
    {
      path: "/profile/admin/add-book",
      label: "Add Book",
      icon: BookPlus,
      gradient: "from-emerald-600 to-teal-600",
    },
    {
      path: "/profile/settings",
      label: "Settings",
      icon: Settings,
      gradient: "from-purple-600 to-violet-600",
    },
  ];

  const menuItems = role === "admin" ? adminMenuItems : userMenuItems;

  // ✅ Clean async/await version
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    try {
      setIsUploading(true);

      // Convert image to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });

      // Update profile with new avatar
      await api.put(`/update-profile`, { avatar: base64Image });

      // Update Redux state immediately
      dispatch(authActions.updateUser({ avatar: base64Image }));

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating avatar:", error);
      alert("Failed to update profile picture");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      dispatch(authActions.setLoggingOut(true));

      // Call logout API to clear server-side cookie
      await api.post("/logout");

      // Clear all storage (localStorage + sessionStorage)
      clearAuthStorage();

      // Clear Redux state completely
      dispatch(authActions.logout());

      // Navigate to home page
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
      
      // Even if API call fails, clear everything locally
      clearAuthStorage();
      dispatch(authActions.logout());
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="sidebar bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 rounded-xl shadow-2xl flex flex-col h-full">
      {/* Profile Section */}
      <div className="flex flex-col items-center">
        <div
          className="relative group cursor-pointer"
          onClick={handleImageClick}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative h-24 w-24 rounded-full border-4 border-zinc-700 group-hover:border-emerald-600/50 transition-all duration-300 overflow-hidden">
            {user?.avatar ? (
              <img
                src={`${user.avatar}?t=${Date.now()}`} // ✅ cache-busting
                alt="profile-pic"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                {user?.username?.charAt(0)?.toUpperCase() || "U"}
              </div>
            )}
          </div>

          {/* Upload overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Camera size={24} className="text-white" />
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        <h3 className="text-zinc-100 mt-4 text-xl font-bold tracking-wide">
          {user?.username || "Loading..."}
        </h3>
        <p className="text-zinc-400 text-sm mt-1">
          {user?.email || "Loading..."}
        </p>

        {/* Upload button */}
        <button
          onClick={handleImageClick}
          disabled={isUploading}
          className="mt-3 flex items-center gap-2 px-3 py-1 bg-zinc-700 hover:bg-zinc-600 disabled:bg-zinc-800 text-zinc-300 text-xs rounded-full transition-all duration-300 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <div className="w-3 h-3 border border-zinc-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Upload size={12} />
              <span>Change Photo</span>
            </>
          )}
        </button>

        <div className="w-full mt-6 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent"></div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-8 w-full">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden text-zinc-300 hover:text-white"
                >
                  {/* Gradient Background - Only shows on hover */}
                  <div
                    className={`
                    absolute inset-0 bg-gradient-to-r ${item.gradient}
                    transition-all duration-300 opacity-0 group-hover:opacity-100
                  `}
                  ></div>

                  {/* Content */}
                  <Icon
                    size={20}
                    className="relative z-10 transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="relative z-10 font-medium">
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-6">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="
            w-full flex items-center justify-center gap-3 
            bg-gradient-to-r from-red-600 to-red-700 
            hover:from-red-700 hover:to-red-800
            disabled:from-gray-600 disabled:to-gray-600
            text-white font-semibold py-3 px-4 rounded-lg
            transform transition-all duration-300 
            hover:scale-105 active:scale-95 disabled:scale-100
            shadow-lg hover:shadow-xl disabled:cursor-not-allowed
          "
        >
          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut size={20} />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
