// SellerSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Settings,
  LogOut,
  ShoppingBasket,
  ChevronRight,
  Home,
  Users,
  Wallet,
  Menu,
  X,
  Star,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { logoutUser } from "../../features/auth/authSlice";
import { clearCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

const SellerSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const { user } = useSelector((state) => state.auth);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
        setIsMobileOpen(false);
      } else {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close mobile sidebar when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    const toastId = toast.loading("Signing out...");
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      dispatch(clearCart());
      toast.success("Signed out successfully", { id: toastId });
    } catch (err) {
      toast.error("Logout failed. Please try again.", { id: toastId });
    }
  };

  const menuItems = [
    {
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/seller",
    },
    {
      icon: <Package size={20} />,
      label: "Products",
      path: "/seller/products",
    },
    {
      icon: <ShoppingBag size={20} />,
      label: "Orders",
      path: "/seller/orders",
    },
    {
      icon: <Users size={20} />,
      label: "Customers",
      path: "#",
    },
    {
      icon: <Wallet size={20} />,
      label: "Payouts",
      path: "/seller/payouts",
    },
    {
      icon: <Home size={20} />,
      label: "Back To Home",
      path: "/",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "#",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button - Positioned at top left */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-lg shadow-lg flex items-center justify-center hover:shadow-xl transition-all"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "280px",
          x: isMobileOpen ? 0 : 0, // Handled by class on mobile
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-xl z-[60] flex flex-col overflow-hidden ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Toggle Button (Desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 w-7 h-7 bg-white rounded-full border border-gray-200 items-center justify-center hover:border-amber-300 hover:shadow-md transition-all z-10"
        >
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-transform duration-300 ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>

        {/* Close Button (Mobile only) */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
        >
          <X size={16} />
        </button>

        {/* Brand Area */}
        <div className="px-4 py-6 border-b border-gray-100 flex-shrink-0">
          <Link to="/seller" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <ShoppingBasket className="w-5 h-5 text-white" />
            </div>

            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden whitespace-nowrap"
                >
                  <h2 className="text-lg font-bold text-gray-900 leading-none">
                    Seller<span className="text-amber-600">Hub</span>
                  </h2>
                  <p className="text-[10px] text-gray-400 font-medium tracking-wider mt-1 uppercase">
                    VENDOR PORTAL
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 custom-scrollbar">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                  title={isCollapsed ? item.label : ""}
                >
                  <div
                    className={`flex-shrink-0 transition-colors ${isActive ? "text-white" : "text-gray-400 group-hover:text-amber-600"}`}
                  >
                    {item.icon}
                  </div>

                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 mt-auto">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Log Out" : ""}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-medium text-sm"
              >
                Log Out
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Spacer */}
      <motion.div
        animate={{
          width: isCollapsed ? "80px" : "280px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block h-screen flex-shrink-0 pointer-events-none transition-all"
      />
    </>
  );
};

export default SellerSidebar;
