import { useState, useMemo } from "react";
import api from "../util/axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { 
  Eye, 
  EyeOff, 
  User, 
  Mail, 
  Lock, 
  MapPin, 
  CheckCircle, 
  XCircle,
  Loader2,
  BookOpen,
  AlertCircle,
  ShoppingBag,
  ArrowLeft
} from "lucide-react";

const SignUp = () => {
  const [searchParams] = useSearchParams();
  const selectedRole = searchParams.get('role') || 'user';
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    address: "",
  });

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Password strength calculation
  const passwordStrength = useMemo(() => {
    const password = formData.password;
    let strength = 0;
    let label = "Very Weak";
    let color = "bg-red-500";

    if (password.length >= 6) strength += 1;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    if (strength <= 1) { label = "Very Weak"; color = "bg-red-500"; }
    else if (strength === 2) { label = "Weak"; color = "bg-orange-500"; }
    else if (strength === 3) { label = "Fair"; color = "bg-yellow-500"; }
    else if (strength === 4) { label = "Good"; color = "bg-lime-500"; }
    else { label = "Strong"; color = "bg-green-500"; }

    return { strength, label, color, percentage: (strength / 5) * 100 };
  }, [formData.password]);

  // Real-time validation
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "username":
        if (value.length > 0 && value.length < 4) {
          error = "Username must be at least 4 characters";
        } else if (!/^[a-zA-Z0-9_]+$/.test(value) && value.length > 0) {
          error = "Only letters, numbers, and underscores allowed";
        }
        break;
      case "email":
        if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Please enter a valid email address";
        }
        break;
      case "password":
        if (value.length > 0 && value.length < 6) {
          error = "Password must be at least 6 characters";
        }
        break;
      case "address":
        if (value.length > 0 && value.length < 10) {
          error = "Please enter a complete address";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
      if (!formData[key]) newErrors[key] = "This field is required";
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({ username: true, email: true, password: true, address: true });
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      await api.post(`/signup`, formData);
      toast.success("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Helper functions to get input styles
  const getInputClasses = (name, isTextarea = false) => {
    const hasError = touched[name] && errors[name];
    const isValid = touched[name] && !errors[name] && formData[name].length > 0;
    
    const baseClasses = `w-full pl-11 ${name === 'password' ? 'pr-11' : 'pr-10'} py-3.5 rounded-xl bg-zinc-700/50 border text-white placeholder-zinc-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:bg-zinc-700`;
    const borderClasses = hasError 
      ? "border-red-500/50 focus:ring-red-500/30 focus:border-red-500" 
      : isValid 
        ? "border-green-500/50 focus:ring-green-500/30 focus:border-green-500"
        : "border-zinc-600 focus:ring-yellow-400/30 focus:border-yellow-400";
    
    return `${baseClasses} ${borderClasses} ${isTextarea ? 'resize-none' : ''}`;
  };

  const getIconClasses = (name, isTextarea = false) => {
    const hasError = touched[name] && errors[name];
    const isValid = touched[name] && !errors[name] && formData[name].length > 0;
    
    return `absolute left-3.5 ${isTextarea ? 'top-3.5' : 'top-1/2 -translate-y-1/2'} w-5 h-5 transition-colors duration-200 ${hasError ? 'text-red-400' : isValid ? 'text-green-400' : 'text-zinc-400 group-focus-within:text-yellow-400'}`;
  };

  const showValidIcon = (name) => {
    return touched[name] && !errors[name] && formData[name].length > 0;
  };

  const showErrorIcon = (name) => {
    return touched[name] && errors[name];
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-400/5 rounded-full blur-3xl" />
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
        <div className="bg-zinc-800/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-zinc-700/50">
          {/* Logo/Brand */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-400/20">
              <BookOpen className="w-8 h-8 text-zinc-900" />
            </div>
            <h2 className="text-2xl font-bold text-white">Create Account</h2>
            <p className="text-zinc-400 text-sm mt-1">Join BookMart today</p>
          </div>

          {/* Role Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/30">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
              <span className="text-sm font-medium text-yellow-400">User Account</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-1.5">
              <div className="relative group">
                <User className={getIconClasses('username')} />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('username')}
                  required
                />
                {showValidIcon('username') && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
                {showErrorIcon('username') && (
                  <XCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                )}
              </div>
              {touched.username && errors.username && (
                <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.username}
                </p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <div className="relative group">
                <Mail className={getIconClasses('email')} />
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={getInputClasses('email')}
                  required
                />
                {showValidIcon('email') && (
                  <CheckCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                )}
                {showErrorIcon('email') && (
                  <XCircle className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                )}
              </div>
              {touched.email && errors.email && (
                <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>
            
            {/* Password Field */}
            <div className="space-y-2">
              <div className="space-y-1.5">
                <div className="relative group">
                  <Lock className={getIconClasses('password')} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={getInputClasses('password')}
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
                {touched.password && errors.password && (
                  <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password.length > 0 && (
                <div className="space-y-1.5 px-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-zinc-400">Password strength</span>
                    <span className={`text-xs font-medium ${
                      passwordStrength.strength <= 2 ? 'text-red-400' : 
                      passwordStrength.strength === 3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300 rounded-full`}
                      style={{ width: `${passwordStrength.percentage}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      { check: formData.password.length >= 6, label: "6+ chars" },
                      { check: /[A-Z]/.test(formData.password), label: "Uppercase" },
                      { check: /[0-9]/.test(formData.password), label: "Number" },
                      { check: /[^A-Za-z0-9]/.test(formData.password), label: "Symbol" },
                    ].map((req, i) => (
                      <span 
                        key={i}
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          req.check 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                            : 'bg-zinc-700/50 text-zinc-500 border border-zinc-600/50'
                        }`}
                      >
                        {req.check && <CheckCircle className="w-2.5 h-2.5 inline mr-0.5" />}
                        {req.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Address Field */}
            <div className="space-y-1.5">
              <div className="relative group">
                <MapPin className={getIconClasses('address', true)} />
                <textarea
                  name="address"
                  placeholder="Shipping Address"
                  value={formData.address}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  rows={3}
                  className={getInputClasses('address', true)}
                  required
                />
                {showValidIcon('address') && (
                  <CheckCircle className="absolute right-3.5 top-3.5 w-5 h-5 text-green-400" />
                )}
                {showErrorIcon('address') && (
                  <XCircle className="absolute right-3.5 top-3.5 w-5 h-5 text-red-400" />
                )}
              </div>
              {touched.address && errors.address && (
                <p className="text-red-400 text-xs ml-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.address}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 font-semibold py-3.5 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-zinc-500 text-xs">OR</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          <p className="text-zinc-400 text-sm text-center">
            Already have an account?{" "}
            <Link 
              to="/login?role=user" 
              className="text-yellow-400 hover:text-yellow-300 font-medium transition-colors hover:underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-zinc-800/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-700/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-400/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-300">User Account Benefits</p>
              <p className="text-xs text-zinc-500">Browse books, add to cart, track orders</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-zinc-600 text-xs text-center mt-6">
          By creating an account, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default SignUp;
