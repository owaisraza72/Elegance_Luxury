// SellerOrders.jsx - Enhanced Version
import { useState, useMemo } from "react";
import {
  useGetSellerOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../features/orders/orderApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  Filter,
  Eye,
  Calendar,
  User,
  MapPin,
  RefreshCw,
  Package,
  Loader2,
  ChevronRight,
  MoreVertical,
  Activity,
  CreditCard,
  AlertTriangle,
  ExternalLink,
  Download,
  Printer,
  Mail,
  Phone,
  DollarSign,
  TrendingUp,
  PackageCheck,
  PackageX,
  PackageOpen,
} from "lucide-react";

const SellerOrders = () => {
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError, refetch } = useGetSellerOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [dateRange, setDateRange] = useState("all");

  // Filter orders and items to only show what belongs to this seller
  const filteredOrders = useMemo(() => {
    return (
      data?.orders
        ?.map((order) => {
          const myItems = order.items.filter(
            (item) =>
              item.product?.seller === user._id ||
              item.product?.seller?._id === user._id,
          );
          return { ...order, myItems };
        })
        .filter((order) => {
          const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

          const matchesStatus =
            statusFilter === "all" || order.status === statusFilter;
          
          const hasMyProducts = order.myItems.length > 0;

          // Date filtering
          let matchesDate = true;
          if (dateRange !== "all") {
            const orderDate = new Date(order.createdAt);
            const now = new Date();
            const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
            
            if (dateRange === "today") matchesDate = daysDiff === 0;
            else if (dateRange === "week") matchesDate = daysDiff <= 7;
            else if (dateRange === "month") matchesDate = daysDiff <= 30;
          }

          return matchesSearch && matchesStatus && hasMyProducts && matchesDate;
        }) || []
    );
  }, [data, searchTerm, statusFilter, dateRange, user._id]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (acc, order) =>
        acc + order.myItems.reduce((iAcc, i) => iAcc + i.price * i.quantity, 0),
      0
    );
    
    return {
      total: filteredOrders.length,
      pending: filteredOrders.filter((o) => o.status === "pending").length,
      processing: filteredOrders.filter((o) => o.status === "processing").length,
      shipped: filteredOrders.filter((o) => o.status === "shipped").length,
      delivered: filteredOrders.filter((o) => o.status === "delivered").length,
      cancelled: filteredOrders.filter((o) => o.status === "cancelled").length,
      revenue: totalRevenue,
      averageOrderValue: filteredOrders.length > 0 
        ? (totalRevenue / filteredOrders.length).toFixed(2) 
        : 0,
    };
  }, [filteredOrders]);

  const handleUpdateStatus = async (id, status) => {
    const toastId = toast.loading("Updating order status...");
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Order marked as ${status}`, { id: toastId });
      refetch();
      if (selectedOrder?._id === id) {
        setSelectedOrder({ ...selectedOrder, status });
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status", {
        id: toastId,
      });
    }
  };

  const handleRefresh = async () => {
    const promise = refetch();
    toast.promise(promise, {
      loading: "Refreshing orders...",
      success: "Orders updated!",
      error: "Refresh failed.",
    });
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(filteredOrders, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `orders_export_${new Date().toISOString()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast.success("Orders exported successfully");
  };

  const statusColors = {
    pending: "text-amber-600 bg-amber-50 border-amber-200",
    processing: "text-blue-600 bg-blue-50 border-blue-200",
    shipped: "text-indigo-600 bg-indigo-50 border-indigo-200",
    delivered: "text-green-600 bg-green-50 border-green-200",
    cancelled: "text-red-600 bg-red-50 border-red-200",
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    processing: <PackageOpen className="w-4 h-4" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <PackageCheck className="w-4 h-4" />,
    cancelled: <PackageX className="w-4 h-4" />,
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-3 border-gray-200 border-t-amber-500 rounded-full mb-6"
        />
        <p className="text-gray-400 font-light tracking-widest">
          LOADING YOUR ORDERS
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-2xl border border-red-100 text-center">
        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-light text-gray-900 mb-3">
          Failed to Load Orders
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          There was an error fetching your orders. Please try again.
        </p>
        <button
          onClick={handleRefresh}
          className="px-8 py-3 bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-light hover:shadow-xl transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-gray-200 p-6"
      >
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Sales Orders
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-light">
                {stats.total} Orders
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-500 font-light">
                Manage your incoming orders
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRefresh}
              className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors"
            >
              <RefreshCw size={18} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleExport}
              className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              <Download size={18} />
              <span className="text-sm font-medium">Export</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.revenue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Order Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.averageOrderValue}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Delivered</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.delivered}</p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl border border-gray-200 p-4"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                className="bg-transparent outline-none text-sm font-medium"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                className="bg-transparent outline-none text-sm font-medium"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Orders List */}
      <AnimatePresence mode="popLayout">
        {filteredOrders.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredOrders.map((order, idx) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Order Header */}
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                        <Package className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[order.status]}`}
                          >
                            {statusIcons[order.status]}
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <User className="w-4 h-4" />
                            {order.user?.name}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2"
                      >
                        <Eye size={16} />
                        View Details
                      </button>

                      <div className="relative">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <MoreVertical size={18} className="text-gray-500" />
                        </button>
                        
                        {/* Status Dropdown */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-10 hidden group-hover:block">
                          <div className="py-1">
                            {["processing", "shipped", "delivered", "cancelled"].map((status) => (
                              <button
                                key={status}
                                onClick={() => handleUpdateStatus(order._id, status)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <span className={`w-2 h-2 rounded-full ${
                                  status === "processing" ? "bg-blue-500" :
                                  status === "shipped" ? "bg-indigo-500" :
                                  status === "delivered" ? "bg-green-500" : "bg-red-500"
                                }`} />
                                Mark as {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {order.myItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product?.imageUrl}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {item.product?.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">
                              Qty: {item.quantity}
                            </span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-sm font-semibold text-gray-900">
                              ${item.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {order.shippingAddress?.city}, {order.shippingAddress?.country}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="text-xl font-semibold text-gray-900">
                        ${order.myItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border border-gray-200 p-12 text-center"
          >
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No Orders Found</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || statusFilter !== "all" || dateRange !== "all"
                ? "No orders match your current filters. Try adjusting your search criteria."
                : "You haven't received any orders yet. Orders will appear here once customers purchase your products."}
            </p>
            {(searchTerm || statusFilter !== "all" || dateRange !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateRange("all");
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-light text-gray-900">Order Details</h2>
                  <p className="text-sm text-gray-500">#{selectedOrder._id}</p>
                </div>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-8">
                {/* Customer Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Customer Information</h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="font-medium text-gray-900">{selectedOrder.user?.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">{selectedOrder.user?.email}</p>
                        </div>
                      </div>
                      {selectedOrder.user?.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{selectedOrder.user.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Shipping Address</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Address</p>
                          <p className="font-medium text-gray-900">
                            {selectedOrder.shippingAddress?.street}<br />
                            {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zipCode}<br />
                            {selectedOrder.shippingAddress?.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.myItems.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={item.product?.imageUrl}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                          <p className="text-sm text-gray-500 mb-2">{item.product?.description}</p>
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600">Quantity: {item.quantity}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-sm font-semibold text-gray-900">${item.price} each</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Subtotal</p>
                          <p className="text-xl font-semibold text-gray-900">
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium text-gray-900">
                        ${selectedOrder.myItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="font-medium text-gray-900">Total</span>
                      <span className="text-xl font-semibold text-gray-900">
                        ${selectedOrder.myItems.reduce((acc, i) => acc + i.price * i.quantity, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                <div className="flex gap-3 pt-4">
                  {["processing", "shipped", "delivered"].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                      disabled={selectedOrder.status === status}
                      className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerOrders;