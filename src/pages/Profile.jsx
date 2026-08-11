import { useEffect, useState } from "react";
import api from "../util/axios";
import Loader from "../components/Loader/Loader";
import Sidebar from "../components/Profile/Sidebar";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../store/auth";

// withCredentials is already handled in api instance

const Profile = () => {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/get-user-information`);
        
        // ✅ update redux state with user data
        dispatch(authActions.setUser(response.data));
        dispatch(authActions.login());
        dispatch(authActions.changeRole(response.data.role));
      } catch (error) {
        console.error(error);
        setMessage("Failed to fetch user info. Please login again.");
      }
    };

    // Only fetch if user is not already in Redux state
    if (!user) {
      fetchUser();
    }
  }, [dispatch, user]);

  if (message) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-white">
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 px-2 md:px-12 flex flex-col md:flex-row h-auto py-8 gap-4 text-white">
      {!user && (
        <div className="w-full h-[100%] flex items-center justify-center">
          <Loader />
        </div>
      )}
      {user && (
        <>
          <div className="w-full md:w-1/6">
            <Sidebar />
          </div>
          <div className="w-full md:w-5/6">
            <Outlet />
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
