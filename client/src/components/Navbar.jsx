import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApi";
import { logoutUser } from "../features/auth/authSlice";
import { clearCart } from "../features/cart/cartSlice";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Bell,
  Package,
  Star,
  Crown,
  Gem,
  Home,
  Sparkles,
  Tag,
  LayoutDashboard,
} from "lucide-react";

const Navbar = () => {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [logout] = useLogoutMutation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLink, setActiveLink] = useState("");
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const wishlistCount =
    useSelector((state) => state.wishlist?.items?.length) || 0;

  // Update active link based on current path
  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        // Optional: Close search suggestions if needed
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Extract search query from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    setSearchQuery(search);
  }, [location.search]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/products");
    }
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutUser());
      dispatch(clearCart()); // Clear cart notifications on logout
      toast.success("Signed out successfully", {
        icon: "👋",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      navigate("/login");
      setIsUserMenuOpen(false);
    } catch (err) {
      toast.error("Sign out failed. Please try again.");
    }
  };

  const navigationLinks = [
    { name: "Home", path: "/", icon: <Home size={16} /> },
    { name: "Collection", path: "/collection", icon: <Sparkles size={16} /> },
    {
      name: "New",
      path: "/new-arrivals",
      icon: <Tag size={16} />,
      badge: "NEW",
    },
    { name: "Designers", path: "/designers", icon: <Crown size={16} /> },
    { name: "Sale", path: "/sale", icon: <Tag size={16} />, badge: "50% OFF" },
  ];

  const userMenuItems = user
    ? [
        { icon: <User size={18} />, label: "My Profile", path: "/profile" },
        ...(user.role === "user"
          ? [
              {
                icon: <Package size={18} />,
                label: "My Orders",
                path: "/orders",
              },
              {
                icon: <Heart size={18} />,
                label: "My Favorites",
                path: "/wishlist",
              },
            ]
          : []),
        ...(user.role === "seller"
          ? [
              {
                icon: <LayoutDashboard size={18} />,
                label: "Seller Dashboard",
                path: "/seller",
                color: "text-amber-600",
              },
            ]
          : []),
        ...(user.role === "admin"
          ? [
              {
                icon: <Gem size={18} />,
                label: "Admin Dashboard",
                path: "/admin",
                color: "text-violet-600",
              },
            ]
          : []),
        {
          icon: <X size={18} />,
          label: "Sign Out",
          onClick: handleLogout,
          color: "text-red-500",
        },
      ]
    : [];

  const NavLink = ({ to, children, badge, icon, className = "" }) => (
    <Link
      to={to}
      className={`relative flex items-center gap-2 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
        activeLink === to
          ? "text-amber-700 bg-amber-50"
          : "text-gray-600 hover:text-amber-600 hover:bg-gray-50"
      } ${className}`}
      onClick={() => setIsMenuOpen(false)}
    >
      {icon && (
        <span className="text-gray-400 group-hover:text-amber-500">{icon}</span>
      )}
      <span className="font-medium text-sm tracking-wide">{children}</span>
      {badge && (
        <span className="absolute -top-1 -right-1 text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full font-bold">
          {badge}
        </span>
      )}
    </Link>
  );

  return (
    <>
      {/* Top Announcement Bar - Minimal */}
      <div className="bg-gradient-to-r from-gray-900 to-black">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <div className="flex items-center justify-center gap-2">
            <Gem size={12} className="text-amber-400" />
            <span className="text-xs text-white/90 font-light tracking-widest">
              FREE EXPRESS SHIPPING • 24/7 SUPPORT
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm"
            : "bg-white border-b border-gray-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-3 group"
                onClick={() => setIsMenuOpen(false)}
              >
                <motion.div whileHover={{ rotate: 12 }} className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-rose-500 rounded-xl flex items-center justify-center shadow-md shadow-amber-500/30">
                    <Gem className="w-5 h-5 text-white" />
                  </div>
                  <div className="absolute -inset-1 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-xl blur group-hover:blur-md transition-all duration-300" />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-xl font-light tracking-tight text-gray-900">
                    ÉLÉGANCE
                  </span>
                  <span className="text-[10px] tracking-widest text-gray-400 font-light -mt-1">
                    LUXURY
                  </span>
                </div>
              </Link>

              {/* Desktop Navigation Links */}
              <div className="hidden lg:flex items-center gap-1">
                {navigationLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    badge={link.badge}
                    icon={link.icon}
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="w-full" ref={searchRef}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search luxury collections, brands..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm font-normal focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 transition-all outline-none placeholder:text-gray-400"
                  />
                  <button
                    type="submit"
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm font-medium text-amber-600 hover:text-amber-700 transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Action Icons */}
            <div className="flex items-center gap-3">
              {/* Search Mobile */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (searchQuery.trim()) {
                    navigate(`/?search=${searchQuery.trim()}`);
                  } else {
                    // Focus on search input in mobile menu
                    setIsMenuOpen(true);
                  }
                }}
                className="lg:hidden p-2 text-gray-500 hover:text-amber-600 transition-colors"
              >
                <Search size={20} />
              </motion.button>

              {/* Wishlist */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative hidden md:block"
              >
                <Link
                  to="/wishlist"
                  className="p-2 text-gray-500 hover:text-rose-600 transition-colors relative"
                >
                  <Heart size={20} />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                    >
                      {wishlistCount > 9 ? "9+" : wishlistCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Cart */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link
                  to="/cart"
                  className="p-2 text-gray-500 hover:text-amber-600 transition-colors relative"
                >
                  <ShoppingBag size={20} />
                  {cartCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold"
                    >
                      {cartCount > 9 ? "9+" : cartCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* User Menu / Auth */}
              {user ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all ${
                      isUserMenuOpen ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center border border-amber-200">
                      <span className="text-sm font-medium text-amber-700">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <ChevronDown
                      size={14}
                      className={`text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`}
                    />
                  </motion.button>

                  {/* User Dropdown Menu */}
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                      >
                        {/* User Info */}
                        <div className="p-3 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center">
                              <span className="text-sm font-medium text-white">
                                {user.name?.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate capitalize">
                                {user.name}
                              </p>
                              <p className="text-xs text-gray-500 font-light uppercase">
                                {user.role}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          {userMenuItems.map((item, index) =>
                            item.path ? (
                              <Link
                                key={index}
                                to={item.path}
                                onClick={() => {
                                  setIsUserMenuOpen(false);
                                  setIsMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-sm ${item.color || "text-gray-700"}`}
                              >
                                <div
                                  className={`${item.color || "text-gray-400"}`}
                                >
                                  {item.icon}
                                </div>
                                <span className="font-normal flex-1">
                                  {item.label}
                                </span>
                                {item.badge && item.badge > 0 && (
                                  <span className="text-xs px-1.5 py-0.5 bg-gray-100 rounded-full min-w-[20px] text-center">
                                    {item.badge}
                                  </span>
                                )}
                              </Link>
                            ) : (
                              <button
                                key={index}
                                onClick={() => {
                                  item.onClick?.();
                                  setIsUserMenuOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-sm ${item.color || "text-gray-700"}`}
                              >
                                <div
                                  className={`${item.color || "text-gray-400"}`}
                                >
                                  {item.icon}
                                </div>
                                <span className="font-normal flex-1 text-left">
                                  {item.label}
                                </span>
                              </button>
                            ),
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-600 hover:text-amber-600 font-medium text-sm transition-colors"
                  >
                    Sign In
                  </Link>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-gradient-to-r from-gray-900 to-black text-white font-medium text-sm rounded-lg hover:shadow-md transition-all"
                    >
                      Join
                    </Link>
                  </motion.div>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-500 hover:text-amber-600 transition-colors"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, brands..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg py-2.5 pl-10 pr-4 text-sm font-normal focus:bg-white focus:border-amber-300 focus:outline-none"
                      autoFocus
                    />
                  </div>
                </form>

                {/* Mobile Navigation Links */}
                <div className="space-y-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        activeLink === link.path
                          ? "bg-amber-50 text-amber-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {link.icon}
                      <span className="font-medium text-sm">{link.name}</span>
                      {link.badge && (
                        <span className="ml-auto text-xs px-2 py-1 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-full font-bold">
                          {link.badge}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
                {/* Auth Links */}
                {!user ? (
                  <div className="space-y-2 pt-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-3 text-center font-medium text-gray-700 hover:bg-gray-50 rounded-lg border border-gray-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-3 py-3 text-center bg-gradient-to-r from-gray-900 to-black text-white font-medium rounded-lg"
                    >
                      Create Account
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="px-3 py-3 bg-gray-50 rounded-lg mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-rose-500 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 capitalize">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500 font-light uppercase">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </div>
                    {userMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path || "#"}
                        onClick={(e) => {
                          if (item.onClick) {
                            e.preventDefault();
                            item.onClick();
                          }
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center gap-3 px-3 py-3 text-gray-700 hover:bg-gray-50 rounded-lg text-sm"
                      >
                        <div className="text-gray-400">{item.icon}</div>
                        <span className="font-normal">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
