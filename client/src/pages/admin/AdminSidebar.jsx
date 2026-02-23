// AdminSidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Package,
  BarChart3,
  ChevronRight,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  Tag,
  Home,
  HelpCircle,
  FileText,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { useLogoutMutation } from "../../features/auth/authApi";
import { logoutUser } from "../../features/auth/authSlice";
import { clearCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";
import { useState } from "react";

const AdminSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    const toastId = toast.loading("Ending admin session...");
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      dispatch(clearCart());
      toast.success("Admin session ended", { id: toastId });
    } catch (err) {
      toast.error("Logout failed. Please try again.", { id: toastId });
    }
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/admin" },
    { icon: <Users size={20} />, label: "Users", path: "/admin/users" },
    { icon: <ShoppingBag size={20} />, label: "Orders", path: "/admin/orders" },
    { icon: <Package size={20} />, label: "Products", path: "/admin/products" },
    {
      icon: <BarChart3 size={20} />,
      label: "Analytics",
      path: "/admin/analytics",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Payments",
      path: "/admin/payments",
    },
    { icon: <Tag size={20} />, label: "Discounts", path: "/admin/discounts" },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/admin/settings",
    },
    { icon: <Home size={20} />, label: "Back to Store", path: "/" },
  ];

  return (
    <>
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? "80px" : "256px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="bg-white border-r border-gray-200 flex flex-col h-screen fixed top-0 left-0 z-[60] overflow-hidden shadow-xl"
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-6 w-7 h-7 bg-white rounded-full border border-gray-200 items-center justify-center hover:border-amber-300 hover:shadow-md transition-all z-100"
        >
          <ChevronRight
            size={14}
            className={`text-gray-400 transition-transform duration-300 ${
              isCollapsed ? "" : "rotate-180"
            }`}
          />
        </button>

          {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <p className="text-xs text-gray-500">E-commerce Management</p>
          </div>
        </Link>
      </div>

        {/* Navigation Section */}
        <nav className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-1">
          {menuItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path === "/admin" && location.pathname === "/admin/");

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-lg shadow-amber-500/20"
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
                    className="font-medium text-sm whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer/Logout Section */}
        <div className="p-4 border-t border-gray-100 flex-shrink-0 mt-auto bg-gray-50/50">
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300 group ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Log Out" : ""}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <LogOut size={18} />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-bold text-sm"
              >
                Log Out
              </motion.span>
            )}
          </button>
        </div>
      </motion.aside>

      {/* Dynamic Content Spacer */}
      <motion.div
        animate={{
          width: isCollapsed ? "80px" : "256px",
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden lg:block h-screen flex-shrink-0 pointer-events-none"
      />
    </>
  );
};

export default AdminSidebar;
