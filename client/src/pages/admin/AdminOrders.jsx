import { useState } from "react";
import {
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
} from "../../features/orders/orderApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  Search,
  Filter,
  Eye,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  CreditCard,
  RefreshCw,
  AlertCircle,
  Package,
  ChevronRight,
  Loader2,
} from "lucide-react";

const AdminOrders = () => {
  const { data, isLoading, isError, refetch } = useGetAdminOrdersQuery();
  const [updateStatus] = useUpdateOrderStatusMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const filteredOrders =
    data?.orders?.filter((order) => {
      const matchesSearch =
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    }) || [];

  const handleUpdateStatus = async (id, status) => {
    const toastId = toast.loading("Updating status...");
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success("Order status updated", { id: toastId });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update", { id: toastId });
    }
  };

  const statusColors = {
    pending: "bg-amber-50 text-amber-600 border-amber-100",
    processing: "bg-blue-50 text-blue-600 border-blue-100",
    shipped: "bg-indigo-50 text-indigo-600 border-indigo-100",
    delivered: "bg-green-50 text-green-600 border-green-100",
    cancelled: "bg-red-50 text-red-600 border-red-100",
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    processing: <RefreshCw className="w-4 h-4 animate-spin" />,
    shipped: <Truck className="w-4 h-4" />,
    delivered: <CheckCircle2 className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />,
  };

  if (isLoading)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-4" />
        <p className="text-gray-500">Loading order database...</p>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-gray-900 mb-2">
          Order Management
        </h1>
        <p className="text-gray-500 font-light">
          View and manage all system orders
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer Name..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl">
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
          <button
            onClick={refetch}
            className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 text-gray-500"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-widest text-gray-400">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-widest text-gray-400">
                  Total
                </th>
                <th className="px-6 py-4 text-center text-xs font-black uppercase tracking-widest text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-xs text-gray-400">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">
                      {order.user?.name || "Guest"}
                    </p>
                    <p className="text-xs text-gray-400">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border flex items-center gap-1.5 w-fit ${statusColors[order.status]}`}
                    >
                      {statusIcons[order.status]}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="font-black text-gray-900 text-lg">
                      ${order.totalAmount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowOrderModal(true);
                        }}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <div className="relative group">
                        <button className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100 transition-colors">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 invisible group-hover:visible z-20 overflow-hidden">
                          {[
                            "pending",
                            "processing",
                            "shipped",
                            "delivered",
                            "cancelled",
                          ].map((status) => (
                            <button
                              key={status}
                              onClick={() =>
                                handleUpdateStatus(order._id, status)
                              }
                              className="w-full px-4 py-2.5 text-left text-xs font-bold hover:bg-gray-50 flex items-center gap-2 capitalize border-b border-gray-50 last:border-0"
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${statusColors[status].split(" ")[1]}`}
                              />
                              Set as {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="py-20 text-center">
              <Package className="w-16 h-16 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-400 font-bold">
                No orders found matching your search
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderModal && selectedOrder && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 md:p-12 relative">
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="absolute top-8 right-8 p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all"
                >
                  <XCircle className="w-6 h-6 text-gray-400" />
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
                  <div>
                    <h2 className="text-4xl font-black text-gray-900 mb-2 font-heading">
                      Order Details
                    </h2>
                    <p className="text-indigo-600 font-mono text-sm tracking-widest font-black uppercase">
                      Ref: #{selectedOrder._id}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-[2rem] border border-gray-100">
                    <div
                      className={`p-4 rounded-2xl ${statusColors[selectedOrder.status]}`}
                    >
                      {statusIcons[selectedOrder.status]}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                        Current Status
                      </p>
                      <p className="font-black text-gray-900 capitalize">
                        {selectedOrder.status}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-indigo-600">
                      <User className="w-5 h-5" />
                      <h4 className="font-black text-[10px] uppercase tracking-widest">
                        Customer Info
                      </h4>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="font-bold text-gray-900">
                        {selectedOrder.user?.name}
                      </p>
                      <p className="text-sm text-gray-400">
                        {selectedOrder.user?.email}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-amber-600">
                      <MapPin className="w-5 h-5" />
                      <h4 className="font-black text-[10px] uppercase tracking-widest">
                        Delivery Address
                      </h4>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="text-sm font-bold text-gray-900">
                        {selectedOrder.shippingAddress?.address}
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedOrder.shippingAddress?.city},{" "}
                        {selectedOrder.shippingAddress?.postalCode}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-emerald-600">
                      <CreditCard className="w-5 h-5" />
                      <h4 className="font-black text-[10px] uppercase tracking-widest">
                        Payment Info
                      </h4>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100">
                      <p className="font-bold text-gray-900 font-heading text-xl">
                        ${selectedOrder.totalAmount}
                      </p>
                      <p className="text-xs text-emerald-600 font-black uppercase tracking-tighter">
                        Status: {selectedOrder.paymentStatus || "Paid"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 text-gray-900">
                    <ShoppingBag className="w-5 h-5" />
                    <h4 className="font-black text-[10px] uppercase tracking-widest">
                      Ordered Items
                    </h4>
                  </div>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-3xl hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                      >
                        <div className="flex items-center gap-6">
                          <img
                            src={item.product?.imageUrl}
                            className="w-20 h-20 bg-gray-50 rounded-2xl object-cover border border-gray-100"
                          />
                          <div>
                            <p className="font-black text-gray-900">
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-gray-400 font-bold">
                              Qty: {item.quantity} × ${item.price}
                            </p>
                          </div>
                        </div>
                        <p className="font-black text-indigo-600 text-lg">
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs font-black uppercase tracking-widest">
                    <Calendar className="w-4 h-4" />
                    Ordered on{" "}
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  <div className="flex gap-4 w-full sm:w-auto">
                    <button className="flex-1 sm:flex-none px-8 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2">
                      <Truck className="w-5 h-5" />
                      Ship Order
                    </button>
                    <button
                      onClick={() => setShowOrderModal(false)}
                      className="flex-1 sm:flex-none px-8 py-4 bg-gray-100 text-gray-500 font-black rounded-2xl hover:bg-gray-200 transition-all"
                    >
                      Close Window
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
