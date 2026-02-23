import { useParams, Link } from "react-router-dom";
import { useGetOrderByIdQuery } from "../../features/orders/orderApi";
import { useState } from "react";
import {
  Package,
  Truck,
  MapPin,
  CreditCard,
  Calendar,
  ChevronLeft,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  ShoppingBag,
  Download,
  Printer,
  Mail,
  Phone,
  MessageCircle,
  HelpCircle,
  Shield,
  Award,
  Star,
  Gift,
  Receipt,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const OrderDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError, refetch } = useGetOrderByIdQuery(id);
  const order = data?.order;
  const [activeTab, setActiveTab] = useState("details");
  const [showTracking, setShowTracking] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

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
        return <Clock className="w-5 h-5" />;
      case "processing":
        return <Loader2 className="w-5 h-5 animate-spin" />;
      case "shipped":
        return <Truck className="w-5 h-5" />;
      case "delivered":
        return <CheckCircle2 className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusProgress = (status) => {
    const steps = ["pending", "processing", "shipped", "delivered"];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? (currentIndex + 1) * 25 : 0;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full mb-6"
        />
        <p className="text-gray-500 font-light">Loading order details...</p>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            We couldn't find the order you're looking for. It may have been
            removed or the link might be expired.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/orders"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg"
            >
              View All Orders
            </Link>
            <button
              onClick={refetch}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Try Again
            </button>
          </div>
        </div>
      </motion.div>
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
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back to Orders</span>
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="mb-10"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6"
          >
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                Order Details
              </h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Package size={16} />
                  <span className="font-mono">
                    #{order._id.slice(-10).toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={16} />
                  <span>{formatDate(order.createdAt)}</span>
                </div>
              </div>
            </div>

            <div
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(order.status)}`}
            >
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </div>
          </motion.div>

          {/* Order Progress */}
          {!["cancelled", "refunded"].includes(order.status) && (
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 p-6 mb-8"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Order Progress
              </h3>
              <div className="flex items-center justify-between mb-3">
                {["Pending", "Processing", "Shipped", "Delivered"].map(
                  (step, index) => {
                    const stepStatus = step.toLowerCase();
                    const isCompleted =
                      (order.status === "delivered" && index < 4) ||
                      (order.status === "shipped" && index < 3) ||
                      (order.status === "processing" && index < 2) ||
                      (order.status === "pending" && index < 1);

                    return (
                      <div key={step} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isCompleted
                              ? "bg-green-500"
                              : index === 0
                                ? "bg-amber-500"
                                : "bg-gray-200"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          ) : index === 0 ? (
                            <Clock className="w-4 h-4 text-white" />
                          ) : null}
                        </div>
                        <span className="text-xs mt-2 text-gray-600">
                          {step}
                        </span>
                      </div>
                    );
                  },
                )}
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${getStatusProgress(order.status)}%` }}
                  transition={{ duration: 1 }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-600"
                />
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Products */}
          <div className="lg:col-span-2 space-y-8">
            {/* Products List */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-medium text-gray-900">
                  Order Items
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {order.items.length}{" "}
                  {order.items.length === 1 ? "item" : "items"} purchased
                </p>
              </div>

              <div className="divide-y divide-gray-100">
                {order.items.map((item, idx) => (
                  <motion.div
                    key={idx}
                    variants={itemVariants}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row gap-6">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product?.imageUrl}
                          alt={item.product?.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <Link
                              to={`/product/${item.product?._id}`}
                              className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                            >
                              {item.product?.name}
                            </Link>
                            <p className="text-sm text-gray-500 mt-1">
                              Quantity: {item.quantity} × ${item.price}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-xl font-semibold text-gray-900">
                              ${(item.quantity * item.price).toFixed(2)}
                            </p>
                            <Link
                              to={`/product/${item.product?._id}`}
                              className="text-xs text-amber-600 hover:text-amber-700 flex items-center gap-1 justify-end mt-1"
                            >
                              View Product
                              <ExternalLink size={12} />
                            </Link>
                          </div>
                        </div>

                        {/* Product Actions */}
                        {order.status === "delivered" && (
                          <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                            <button className="text-sm text-amber-600 hover:text-amber-700 flex items-center gap-1">
                              <Star size={14} />
                              Write Review
                            </button>
                            <button className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                              <Gift size={14} />
                              Buy Again
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Support Options */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4">
                Need Help?
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowSupportModal(true)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <MessageCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Live Chat</span>
                </button>
                <a
                  href="mailto:support@example.com"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Mail className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Email</span>
                </a>
                <a
                  href="tel:+18001234567"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <Phone className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">Call</span>
                </a>
                <Link
                  to="/faq"
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  <HelpCircle className="w-5 h-5 text-amber-600 mx-auto mb-1" />
                  <span className="text-xs font-medium">FAQ</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Info */}
          <div className="space-y-6">
            {/* Order Summary */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Receipt size={18} className="text-amber-600" />
                Order Summary
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium">Included</span>
                </div>
                <div className="h-px bg-gray-200 my-3"></div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-xl font-semibold text-amber-600">
                    ${order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Shipping Information */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <Truck size={18} className="text-amber-600" />
                Shipping Information
              </h3>

              <div className="space-y-3">
                <p className="font-medium text-gray-900 capitalize">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.address}
                  <br />
                  {order.shippingAddress.city},{" "}
                  {order.shippingAddress.postalCode}
                </p>
                <p className="text-sm text-gray-600">
                  {order.shippingAddress.email}
                </p>

                {order.status === "shipped" && (
                  <button
                    onClick={() => setShowTracking(true)}
                    className="mt-3 w-full px-4 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors flex items-center justify-center gap-2"
                  >
                    <Truck size={16} />
                    Track Shipment
                  </button>
                )}
              </div>
            </motion.div>

            {/* Payment Information */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-2xl border border-gray-200 p-6"
            >
              <h3 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-amber-600" />
                Payment Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <img
                    src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/visa.svg"
                    alt="Visa"
                    className="h-6"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Visa ending in 4242
                    </p>
                    <p className="text-xs text-gray-500">Expires 12/25</p>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span>Payment secured by Stripe</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={itemVariants} className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Download size={16} />
                Invoice
              </button>
              <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Printer size={16} />
                Print
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
 
