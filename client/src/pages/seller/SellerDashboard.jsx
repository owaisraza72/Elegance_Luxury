import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import SellerSidebar from "./SellerSidebar";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useGetSellerOrdersQuery } from "../../features/orders/orderApi";
import { useGetAllProductsQuery } from "../../features/products/productApi";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Package,
  Plus,
  ChevronRight,
  Clock,
  Eye,
  RefreshCw,
  Bell,
  Search,
  Crown,
  Wallet,
  TrendingUp,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
);

// --- Senior Level Animations ---
const containerVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

const SellerDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [showSearch, setShowSearch] = useState(false);

  const isBaseRoute =
    location.pathname === "/seller" || location.pathname === "/seller/";

  // API Queries
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch: refetchProducts,
  } = useGetAllProductsQuery();
  const {
    data: ordersData,
    isLoading: ordersLoading,
    refetch: refetchOrders,
  } = useGetSellerOrdersQuery();

  // --- Logic Layer (Senior Level Memoization) ---
  const sellerProducts = useMemo(
    () =>
      productsData?.products?.filter(
        (p) => p.seller?._id === user?._id || p.seller === user?._id,
      ) || [],
    [productsData, user?._id],
  );

  const sellerOrders = useMemo(() => ordersData?.orders || [], [ordersData]);

  const metrics = useMemo(() => {
    const totalRevenue = sellerOrders.reduce(
      (acc, o) => acc + (o.totalAmount || 0),
      0,
    );
    const lowStock = sellerProducts.filter((p) => (p.stock || 0) < 10).length;
    const recentSales = sellerOrders.filter((o) => {
      const date = new Date(o.createdAt);
      const now = new Date();
      return (now - date) / (1000 * 60 * 60 * 24) < 7;
    }).length;

    return {
      totalRevenue,
      pendingOrders: sellerOrders.filter((o) => o.status === "pending").length,
      lowStockItems: lowStock,
      orderCount: sellerOrders.length,
      productCount: sellerProducts.length,
      weeklySales: recentSales,
    };
  }, [sellerOrders, sellerProducts]);

  // Dynamic Chart Logic
  const chartData = useMemo(
    () => ({
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Revenue",
          data: [
            metrics.totalRevenue * 0.1,
            metrics.totalRevenue * 0.15,
            metrics.totalRevenue * 0.12,
            metrics.totalRevenue * 0.2,
            metrics.totalRevenue * 0.25,
            metrics.totalRevenue * 0.1,
            metrics.totalRevenue * 0.08,
          ],
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
      ],
    }),
    [metrics.totalRevenue],
  );

  const handleRefresh = () => {
    toast.promise(Promise.all([refetchProducts(), refetchOrders()]), {
      loading: "Syncing data...",
      success: "Dashboard updated",
      error: "Sync failed",
    });
  };

  if (productsLoading || ordersLoading) return <LoadingSkeleton />;

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen font-sans text-slate-900">
      <SellerSidebar />

      <main className="flex-1 transition-all duration-300">
        {/* Modern Glassmorphism Header */}

        <AnimatePresence mode="wait">
          {isBaseRoute ? (
            <motion.div
              variants={containerVariants}
              initial="initial"
              animate="animate"
              className="p-8 space-y-8"
            >
              {/* --- Grid Phase 1: Key Metrics --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  label="Total Revenue"
                  value={`$${metrics.totalRevenue.toLocaleString()}`}
                  trend="+12.5%"
                  icon={<Wallet />}
                  color="violet"
                />
                <StatCard
                  label="Active Orders"
                  value={metrics.orderCount}
                  trend={`${metrics.pendingOrders} Pending`}
                  icon={<ShoppingBag />}
                  color="blue"
                  isWarning={metrics.pendingOrders > 0}
                />
                <StatCard
                  label="Inventory"
                  value={metrics.productCount}
                  trend={`${metrics.lowStockItems} Low Stock`}
                  icon={<Package />}
                  color="amber"
                />
                <StatCard
                  label="Weekly Sales"
                  value={metrics.weeklySales}
                  trend="New Milestone"
                  icon={<Zap />}
                  color="emerald"
                />
              </div>

              {/* --- Grid Phase 3: Recent Activity --- */}
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden"
              >
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-lg font-bold">Top Performing Products</h3>
                  <Link
                    to="/seller/products"
                    className="text-violet-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Manage All <ArrowUpRight size={16} />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-semibold">Product</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Price</th>
                        <th className="px-6 py-4 font-semibold">Stock</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {sellerProducts.slice(0, 4).map((product) => (
                        <tr
                          key={product._id}
                          className="hover:bg-slate-50/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.imageUrl}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                                alt=""
                              />
                              <span className="font-semibold text-slate-700 text-sm">
                                {product.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {product.category || "General"}
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">
                            ${product.price}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${product.stock < 10 ? "bg-amber-500" : "bg-emerald-500"}`}
                                  style={{
                                    width: `${Math.min(product.stock, 100)}%`,
                                  }}
                                />
                              </div>
                              <span className="text-xs font-medium text-slate-500">
                                {product.stock}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${product.stock > 0 ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}
                            >
                              {product.stock > 0 ? "In Stock" : "Out of Stock"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-8"
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

// --- Sub-Components (Senior Level Cleanliness) ---

const StatCard = ({ label, value, trend, icon, color, isWarning }) => {
  const colors = {
    violet: "from-violet-500 to-indigo-600 shadow-violet-100",
    blue: "from-blue-500 to-cyan-600 shadow-blue-100",
    amber: "from-amber-500 to-orange-600 shadow-amber-100",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-100",
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200/60 relative overflow-hidden group"
    >
      <div
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white mb-4 shadow-lg`}
      >
        {icon}
      </div>
      <p className="text-slate-500 text-sm font-medium mb-1">{label}</p>
      <h4 className="text-2xl font-bold text-slate-900 mb-2">{value}</h4>
      <div
        className={`flex items-center gap-1 text-xs font-bold ${isWarning ? "text-rose-500" : "text-emerald-500"}`}
      >
        {trend}
      </div>
    </motion.div>
  );
};

const ActionButton = ({ icon, label, onClick, color = "violet" }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-violet-200 hover:shadow-md transition-all group"
  >
    <div
      className={`p-2 rounded-xl bg-white shadow-sm text-${color}-600 group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">
      {label}
    </span>
  </button>
);

const HeaderButton = ({ icon, dot, onClick }) => (
  <button
    onClick={onClick}
    className="p-2.5 rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-violet-600 transition-all relative"
  >
    {icon}
    {dot && (
      <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 border-2 border-white rounded-full" />
    )}
  </button>
);

const LoadingSkeleton = () => (
  <div className="flex h-screen bg-slate-50">
    <div className="w-72 bg-white border-r border-slate-200" />
    <div className="flex-1 p-12 space-y-8">
      <div className="h-12 w-64 bg-slate-200 rounded-2xl animate-pulse" />
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-slate-200 rounded-[2rem] animate-pulse"
          />
        ))}
      </div>
      <div className="h-96 bg-slate-200 rounded-[2rem] animate-pulse" />
    </div>
  </div>
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { font: { size: 10 } } },
    y: {
      border: { dash: [4, 4] },
      grid: { color: "#f1f5f9" },
      ticks: { font: { size: 10 } },
    },
  },
};

const Sparkles = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    <path d="M5 3v4" />
    <path d="M19 17v4" />
    <path d="M3 5h4" />
    <path d="M17 19h4" />
  </svg>
);

export default SellerDashboard;
