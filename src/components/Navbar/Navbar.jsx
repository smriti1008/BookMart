import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/bookmart-logo.png";
import { FaGripLines, FaShoppingCart } from "react-icons/fa";
import { LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import api from "../../util/axios";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();
  
  const isAdmin = role === "admin";
  
  // Dynamic links based on role
  const links = [
    { title: "Home", link: "/" },
    { title: "All Books", link: "/all-books" },
    // Show Dashboard for admin, Cart for users
    isAdmin 
      ? { title: "Dashboard", link: "/profile", icon: "dashboard" }
      : { title: "Cart", link: "/cart", icon: "cart" },
    { title: "Profile", link: "/profile" },
  ];

  useEffect(() => {
    if (isLoggedIn) {
      fetchCartCount();
    } else {
      setCartCount(0);
    }
  }, [isLoggedIn]);

  const fetchCartCount = async () => {
    try {
      const response = await api.get(`/cart`);
      const cartItems = response.data.cart || [];
      const count = cartItems.reduce((total, item) => total + (item.qty || 1), 0);
      setCartCount(count);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  };

  // Listen for cart updates
  useEffect(() => {
    const handleCartUpdate = () => {
      if (isLoggedIn) {
        fetchCartCount();
      }
    };

    // Listen for custom cart update events
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, [isLoggedIn]);


  // agar login nahi hai to cart/profile hata do
  if (!isLoggedIn) {
    links.splice(2, 2);
  }

  return (
    <>
      <nav className="navbar relative z-50 bg-zinc-800 text-white px-4 sm:px-6 md:px-8 py-3 sm:py-4 flex items-center justify-between">
        <Link to={"/"} className="logo flex items-center">
          <img src={logo} alt="logo" className="h-8 sm:h-9 md:h-10 m-3 sm:m-4" />
          <h1 className="text-xl sm:text-2xl font-semibold">BookMart</h1>
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          {links.map((item, i) => {
            // Skip Profile from regular links since we'll show it separately
            if (item.title === "Profile") return null;
            
            return (
              <Link
                to={item.link}
                key={i}
                className="hover:text-blue-400 transition-all duration-300 flex items-center gap-1 text-sm sm:text-base"
              >
                {item.icon === "cart" ? (
                  <>
                    <FaShoppingCart className="text-base sm:text-lg" />
                    {item.title}
                    {cartCount > 0 && (
                      <span className="bg-red-500 text-white text-[10px] sm:text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 ml-1">
                        {cartCount}
                      </span>
                    )}
                  </>
                ) : item.icon === "dashboard" ? (
                  <>
                    <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                    {item.title}
                  </>
                ) : (
                  item.title
                )}
              </Link>
            );
          })}

          {/* 👇 Show login/signup when not logged in */}
          {!isLoggedIn && (
            <>
              <Link
                to={"/auth"}
                className="px-3 sm:px-4 py-1.5 border border-blue-500 rounded transition-all duration-300 hover:bg-blue-500 hover:text-white text-sm sm:text-base"
              >
                SignIn
              </Link>
              <Link
                to={"/auth"}
                className="px-3 sm:px-4 py-1.5 bg-blue-500 rounded transition-all duration-300 hover:bg-blue-600 text-white text-sm sm:text-base"
              >
                SignUp
              </Link>
            </>
          )}

          {/* 👇 Show profile picture when logged in */}
          {isLoggedIn && (
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 px-2 sm:px-3 py-1 rounded-full hover:bg-zinc-700 transition-all duration-300"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <span className="text-gray-300 text-xs sm:text-sm font-medium">
                {user?.username || "User"}
              </span>
            </button>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="block md:hidden text-white text-2xl hover:text-amber-400"
          onClick={() => setOpen(!open)}
        >
          <FaGripLines />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`${
          open ? "flex" : "hidden"
        } bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex-col items-center justify-center`}
      >
        {links.map((item, i) => {
          // Skip Profile from regular links since we'll show it separately
          if (item.title === "Profile") return null;
          
          return (
            <Link
              to={item.link}
              key={i}
              className="hover:text-blue-500 mb-6 text-white text-2xl sm:text-3xl font-semibold transition-all duration-300 flex items-center gap-2"
              onClick={() => setOpen(false)}
            >
              {item.icon === "cart" ? (
                <>
                  <FaShoppingCart className="text-2xl sm:text-3xl" />
                  {item.title}
                  {cartCount > 0 && (
                    <span className="bg-red-500 text-white text-xs sm:text-sm rounded-full px-2 py-1">
                      {cartCount}
                    </span>
                  )}
                </>
              ) : item.icon === "dashboard" ? (
                <>
                  <LayoutDashboard className="w-7 h-7 sm:w-8 sm:h-8" />
                  {item.title}
                </>
              ) : (
                item.title
              )}
            </Link>
          );
        })}

        {/* 👇 mobile menu - show login/signup when not logged in */}
        {!isLoggedIn && (
          <>
            <Link
              to={"/auth"}
              className="px-6 py-2 border border-blue-500 rounded transition-all duration-300 hover:bg-blue-500 hover:text-white mb-4 text-zinc-200 text-lg"
              onClick={() => setOpen(false)}
            >
              SignIn
            </Link>
            <Link
              to={"/auth"}
              className="px-6 py-2 bg-blue-500 rounded transition-all duration-300 hover:bg-blue-600 text-white text-lg"
              onClick={() => setOpen(false)}
            >
              SignUp
            </Link>
          </>
        )}

        {/* 👇 mobile menu - show profile picture when logged in */}
        {isLoggedIn && (
          <div className="flex flex-col items-center gap-4 mt-4">
            <button
              onClick={() => {
                navigate("/profile");
                setOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-zinc-700 transition-all duration-300"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Profile"
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-500"
                />
              ) : (
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg">
                  {user?.username?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <div className="text-center">
                <p className="text-white font-medium text-sm sm:text-base">{user?.username || "User"}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{user?.email || ""}</p>
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Navbar;
