import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "../store/auth";
import api from "../util/axios";
import { toast } from "react-toastify";
import { clearAuthStorage } from "../util/storage";
import { 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  Loader2, 
  BookOpen,
  CheckCircle,
  Shield,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";

const Login = () => {
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role') || 'user';
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [loginSuccess, setLoginSuccess] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const isAdmin = selectedRole === 'admin';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("Please fill in all fields");
      setTouched({ username: true, password: true });
      return;
    }

    setIsLoading(true);

    try {
      // Clear any old storage before login
      clearAuthStorage();
      
      const response = await api.post("/sign-in", formData);
      const userResponse = await api.get("/get-user-information");

      // Set user data and login state properly
      dispatch(authActions.setUser(userResponse.data));
      dispatch(authActions.changeRole(response.data.role));
      dispatch(authActions.login({ user: userResponse.data, role: response.data.role }));

      // Show success message with role info
      setLoginSuccess({
        role: response.data.role,
        username: userResponse.data.username
      });
      
      toast.success(`Welcome back, ${userResponse.data.username}! Redirecting to ${response.data.role === 'admin' ? 'Admin Panel' : 'your Profile'}...`);

      setTimeout(() => navigate("/profile"), 1500);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyles = (fieldName) => {
    const isEmpty = touched[fieldName] && !formData[fieldName];
    return `w-full pl-11 pr-11 py-3.5 rounded-xl bg-zinc-700/50 border text-white placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-zinc-700 ${
      isEmpty 
        ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500" 
        : "border-zinc-600 focus:ring-yellow-400/30 focus:border-yellow-400"
    }`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 ${isAdmin ? 'bg-blue-400/5' : 'bg-yellow-400/5'} rounded-full blur-3xl`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 ${isAdmin ? 'bg-purple-400/5' : 'bg-yellow-400/5'} rounded-full blur-3xl`} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back Button */}
        <Link 
          to="/auth" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Back to options</span>
        </Link>

        {/* Card */}
        <div className={`bg-zinc-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border ${isAdmin ? 'border-blue-500/20' : 'border-zinc-700/50'}`}>
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-8">
            <div className={`w-16 h-16 ${isAdmin ? 'bg-gradient-to-br from-blue-400 to-purple-500' : 'bg-gradient-to-br from-yellow-400 to-yellow-500'} rounded-2xl flex items-center justify-center mb-4 shadow-lg ${isAdmin ? 'shadow-blue-400/20' : 'shadow-yellow-400/20'}`}>
              {isAdmin ? <Shield className="w-8 h-8 text-white" /> : <BookOpen className="w-8 h-8 text-zinc-900" />}
            </div>
            <h2 className="text-2xl font-bold text-white">
              {isAdmin ? 'Admin Login' : 'Welcome Back'}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {isAdmin ? 'Sign in to admin panel' : 'Sign in to your account'}
            </p>
          </div>

          {/* Role Badge */}
          <div className="flex justify-center mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${isAdmin ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-yellow-400/10 border border-yellow-400/30'}`}>
              {isAdmin ? <Shield className="w-5 h-5 text-blue-400" /> : <ShoppingBag className="w-5 h-5 text-yellow-400" />}
              <span className={`text-sm font-medium ${isAdmin ? 'text-blue-400' : 'text-yellow-400'}`}>
                {isAdmin ? 'Admin Panel' : 'User Panel'}
              </span>
            </div>
          </div>

          {/* Success State with Role Display */}
          {loginSuccess && (
            <div className={`mb-6 p-4 rounded-xl border ${
              loginSuccess.role === 'admin' 
                ? 'bg-blue-500/10 border-blue-500/20' 
                : 'bg-green-500/10 border-green-500/20'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  loginSuccess.role === 'admin' ? 'bg-blue-500/20' : 'bg-green-500/20'
                }`}>
                  {loginSuccess.role === 'admin' 
                    ? <Shield className="w-5 h-5 text-blue-400" />
                    : <User className="w-5 h-5 text-green-400" />
                  }
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    loginSuccess.role === 'admin' ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {loginSuccess.role === 'admin' ? 'Admin Access Granted' : 'Login Successful'}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Welcome, {loginSuccess.username}!
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="relative group">
              <User className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                touched.username && !formData.username 
                  ? 'text-red-400' 
                  : `text-zinc-400 group-focus-within:${isAdmin ? 'text-blue-400' : 'text-yellow-400'}`
              }`} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputStyles('username')}
                required
              />
              {formData.username && (
                <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
              )}
            </div>

            {/* Password Field */}
            <div className="relative group">
              <Lock className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${
                touched.password && !formData.password 
                  ? 'text-red-400' 
                  : `text-zinc-400 group-focus-within:${isAdmin ? 'text-blue-400' : 'text-yellow-400'}`
              }`} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={getInputStyles('password')}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-yellow-400 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-yellow-400 focus:ring-yellow-400/30 focus:ring-offset-0"
                />
                <span className="text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  Remember me
                </span>
              </label>
              <button 
                type="button"
                className="text-yellow-400 hover:text-yellow-300 transition-colors hover:underline underline-offset-4"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${isAdmin ? 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 shadow-blue-400/20 hover:shadow-blue-400/30 text-white' : 'bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 shadow-yellow-400/20 hover:shadow-yellow-400/30 text-zinc-900'} font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  {isAdmin ? <Shield className="w-5 h-5" /> : <ShoppingBag className="w-5 h-5" />}
                  Sign In as {isAdmin ? 'Admin' : 'User'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          {isAdmin ? (
            <p className="text-zinc-400 text-sm text-center">
              Not an admin?{" "}
              <Link 
                to="/login?role=user" 
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors hover:underline underline-offset-4"
              >
                Sign in as User
              </Link>
            </p>
          ) : (
            <p className="text-zinc-400 text-sm text-center">
              Don't have an account?{" "}
              <Link 
                to="/signup?role=user" 
                className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors hover:underline underline-offset-4"
              >
                Create account
              </Link>
            </p>
          )}
        </div>

        {/* Info Card */}
        <div className={`mt-6 bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border ${isAdmin ? 'border-blue-500/20' : 'border-zinc-700/30'}`}>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <>
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">Admin Panel Access</p>
                  <p className="text-xs text-zinc-500">Manage books, view orders, control inventory</p>
                </div>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-300">User Panel Access</p>
                  <p className="text-xs text-zinc-500">Browse books, manage cart & orders</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
