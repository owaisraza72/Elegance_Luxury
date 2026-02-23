import { useGetMyOrdersQuery } from "../../features/orders/orderApi";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ArrowRight,
  ExternalLink,
  Search,
  Filter,
  Calendar,
  DollarSign,
  ChevronDown,
  ShoppingBag,
  Receipt,
  MapPin,
  CreditCard,
  Download,
  Printer,
  MoreVertical,
  Eye,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";

const Orders = () => {
  const { data, isLoading, isError, refetch } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-100 text-amber-700 border-amber-200",
      processing: "bg-blue-100 text-blue-700 border-blue-200",
      shipped: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
      refunded: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "processing":
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle2 className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusProgress = (status) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? (currentIndex + 1) * 25 : 0;
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some((item) =>
          item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "highest") return b.totalAmount - a.totalAmount;
      if (sortBy === "lowest") return a.totalAmount - b.totalAmount;
      return 0;
    });

  const orderStats = {
    total: orders.length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    processing: orders.filter((o) =>
      ["pending", "processing", "shipped"].includes(o.status),
    ).length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
    totalSpent: orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2),
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full mb-6"
        />
        <p className="text-gray-500 font-light">Loading your orders...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Failed to Load Orders
          </h2>
          <p className="text-gray-500 mb-8">
            There was an error fetching your order history. Please try again.
          </p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium hover:shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-10"
        >
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-gray-900">My Orders</h1>
              <p className="text-gray-500 font-light mt-1">
                Track and manage all your purchases
              </p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
          >
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Orders</p>
              <p className="text-2xl font-semibold text-gray-900">
                {orderStats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Delivered</p>
              <p className="text-2xl font-semibold text-green-600">
                {orderStats.delivered}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Processing</p>
              <p className="text-2xl font-semibold text-amber-600">
                {orderStats.processing}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Cancelled</p>
              <p className="text-2xl font-semibold text-red-600">
                {orderStats.cancelled}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${orderStats.totalSpent}
              </p>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </motion.div>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-gray-200 p-12 text-center"
          >
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No Orders Found
            </h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Looks like you haven't placed any orders yet. Start shopping our premium collection!"}
            </p>
            {searchTerm || statusFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                }}
                className="px-6 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium hover:shadow-lg"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/"
                className="inline-flex px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg"
              >
                Start Shopping
              </Link>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-6"
          >
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order._id}
                variants={itemVariants}
                className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Order Header */}
                <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order Date</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Order ID</p>
                      <p className="text-sm font-mono font-medium text-gray-900">
                        #{order._id.slice(-10).toUpperCase()}
                      </p>
                    </div>

                    <div className="h-8 w-px bg-gray-200"></div>

                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-gray-900">
                          ${order.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>

                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>

                {/* Order Progress Bar */}
                {!["cancelled", "refunded"].includes(order.status) && (
                  <div className="px-6 py-3 border-b border-gray-100 bg-gradient-to-r from-gray-50/50 to-white">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">
                        Order Progress
                      </span>
                      <span className="text-xs font-medium text-gray-700">
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${getStatusProgress(order.status)}%`,
                        }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full ${
                          order.status === "delivered"
                            ? "bg-green-500"
                            : order.status === "shipped"
                              ? "bg-blue-500"
                              : order.status === "processing"
                                ? "bg-amber-500"
                                : "bg-gray-400"
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="p-6">
                  <div className="space-y-4">
                    {order.items.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.product?.imageUrl}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <Link
                            to={`/product/${item.product?._id}`}
                            className="font-medium text-gray-900 hover:text-amber-600 transition-colors"
                          >
                            {item.product?.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            Quantity: {item.quantity} × ${item.price}
                          </p>
                        </div>
                        <span className="font-semibold text-gray-900">
                          ${(item.quantity * item.price).toFixed(2)}
                        </span>
                      </div>
                    ))}

                    {order.items.length > 2 && (
                      <button className="text-sm text-amber-600 hover:text-amber-700 font-medium">
                        + {order.items.length - 2} more items
                      </button>
                    )}
                  </div>

                  {/* Order Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium hover:shadow-lg transition-all text-center flex items-center justify-center gap-2"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    {order.status === "shipped" && (
                      <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
                        <Truck className="w-4 h-4" />
                        Track
                      </button>
                    )}

                    {order.status === "delivered" && (
                      <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                        Write Review
                      </button>
                    )}

                    <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      <Receipt className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Order Details Modal */}
        <AnimatePresence>
          {showDetailsModal && selectedOrder && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowDetailsModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Order Details
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Order ID</p>
                        <p className="font-medium text-gray-900">
                          #{selectedOrder._id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-medium text-gray-900">
                          {new Date(selectedOrder.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Items</h4>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex justify-between">
                            <span>
                              {item.product?.name} x{item.quantity}
                            </span>
                            <span className="font-medium">
                              ${(item.quantity * item.price).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-lg">
                          ${selectedOrder.totalAmount.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="w-full mt-6 px-4 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
