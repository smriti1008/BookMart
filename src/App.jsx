// App.jsx
import Home from './pages/Home'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AuthChoice from './pages/AuthChoice'
import AllBooks from './pages/AllBooks'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import { useDispatch, useSelector } from 'react-redux'
import { authActions } from './store/auth'
import { useEffect, useState } from 'react'
import api from './util/axios'
import Loader from './components/Loader/Loader'
import Favourites from './components/Profile/Favourites'
import UserOrderHistory from './components/Profile/UserOrderHistory'
import Setting from './components/Profile/Setting'
import AdminAllOrders from './components/Profile/AdminAllOrders'
import AdminAddBook from './components/Profile/AdminAddBook'
import AdminDashboard from './components/Profile/AdminDashboard'
import UserDashboard from './components/Profile/UserDashboard'
import EditBook from './pages/EditBook'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const App = () => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const isLoggingOut = useSelector((state) => state.auth.isLoggingOut);
  const lastLogoutTime = useSelector((state) => state.auth.lastLogoutTime);
  const authChecked = useSelector((state) => state.auth.authChecked);

  useEffect(() => {
    let isMounted = true;
    let timeoutId = null;

    const checkAuth = async () => {
      // Skip if already checked
      if (authChecked) {
        return;
      }

      // Skip if currently logging out
      if (isLoggingOut) {
        if (isMounted) {
          dispatch(authActions.setAuthChecked(true));
        }
        return;
      }

      // Skip if user just logged out (within 5 seconds to prevent auto-login)
      const recentLogout = lastLogoutTime && (Date.now() - lastLogoutTime) < 5000;
      if (recentLogout) {
        console.log("⏸️ Skipping auth check - recent logout detected");
        if (isMounted) {
          dispatch(authActions.setAuthChecked(true));
        }
        return;
      }

      try {
        const res = await api.get("/get-user-information"); // sends HTTP-only cookie
        
        if (isMounted) {
          // Set user data and login state properly
          dispatch(authActions.setUser(res.data));
          dispatch(authActions.changeRole(res.data.role));
          dispatch(authActions.login({ user: res.data, role: res.data.role }));
          dispatch(authActions.setAuthChecked(true));
        }
      } catch (err) {
        // Error is already handled by axios interceptor
        // Just mark as checked - user is not authenticated
        if (isMounted) {
          dispatch(authActions.setAuthChecked(true));
        }
      }
    };

    // Only run auth check once if not already checked
    // Add small delay to ensure logout state is properly set
    if (!authChecked) {
      timeoutId = setTimeout(() => {
        checkAuth();
      }, 100);
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [dispatch, isLoggingOut, lastLogoutTime, authChecked]);

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/auth" element={<AuthChoice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/all-books" element={<AllBooks />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />}>
            <Route index element={role === 'admin' ? <AdminDashboard /> : <UserDashboard />} />
            <Route path="/profile/dashboard" element={role === 'admin' ? <AdminDashboard /> : <UserDashboard />} />
            <Route path="/profile/favourites" element={<Favourites />} />
            <Route path="/profile/orderHistory" element={<UserOrderHistory />} />
            <Route path="/profile/settings" element={<Setting />} />
            <Route path="/profile/admin/orders" element={<AdminAllOrders />} />
            <Route path="/profile/admin/add-book" element={<AdminAddBook />} />
          </Route>
          <Route path="/book/:id" element={<ViewBookDetails />} />
          <Route
            path="/edit-book/:id"
            element={role === 'admin' ? <EditBook /> : <Home />}
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
};

export default App;