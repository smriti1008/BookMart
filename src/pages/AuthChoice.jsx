import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Shield, 
  ShoppingBag, 
  Users, 
  Package, 
  Heart,
  BarChart3,
  PlusCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

const AuthChoice = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 px-4 py-8">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400/3 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-yellow-400/20 transform hover:scale-105 transition-transform">
              <BookOpen className="w-10 h-10 text-zinc-900" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            Welcome to <span className="text-yellow-400">BookMart</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Choose how you'd like to continue
          </p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* User Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-zinc-800/80 backdrop-blur-sm rounded-3xl border border-zinc-700/50 overflow-hidden hover:border-yellow-400/30 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 p-6 border-b border-zinc-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
                    <ShoppingBag className="w-7 h-7 text-zinc-900" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">User Account</h2>
                    <p className="text-zinc-400 text-sm">For book lovers & readers</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-zinc-300 text-sm mb-6">
                  Browse our collection, purchase books, and manage your orders with ease.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                      <BookOpen className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm">Browse & purchase books</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm">Save favourites & wishlist</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-yellow-400/10 flex items-center justify-center">
                      <Package className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-sm">Track your orders</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/login?role=user"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-zinc-900 font-semibold py-3 px-4 rounded-xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 flex items-center justify-center gap-2 group/btn"
                  >
                    Sign In as User
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to="/signup?role=user"
                    className="w-full bg-zinc-700/50 text-zinc-200 font-medium py-3 px-4 rounded-xl hover:bg-zinc-700 border border-zinc-600/50 hover:border-yellow-400/30 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    Create User Account
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Card */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-zinc-800/80 backdrop-blur-sm rounded-3xl border border-zinc-700/50 overflow-hidden hover:border-blue-400/30 transition-all duration-300">
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 p-6 border-b border-zinc-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-400/20">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Admin Account</h2>
                    <p className="text-zinc-400 text-sm">For store management</p>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <p className="text-zinc-300 text-sm mb-6">
                  Manage inventory, process orders, and oversee the entire bookstore.
                </p>

                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                      <PlusCircle className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm">Add & manage books</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm">View all orders & analytics</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400">
                    <div className="w-8 h-8 rounded-lg bg-blue-400/10 flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-sm">Manage store operations</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link
                    to="/login?role=admin"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 px-4 rounded-xl hover:from-blue-400 hover:to-purple-400 transition-all duration-200 shadow-lg shadow-blue-400/20 hover:shadow-blue-400/30 flex items-center justify-center gap-2 group/btn"
                  >
                    Sign In as Admin
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                  <div className="w-full bg-zinc-700/30 text-zinc-500 font-medium py-3 px-4 rounded-xl border border-zinc-600/30 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Shield className="w-4 h-4" />
                    Admin signup is restricted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center">
          <p className="text-zinc-500 text-sm mb-4">
            Not sure which to choose? Users can browse and buy books. Admins manage the store.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            Browse books without signing in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthChoice;
