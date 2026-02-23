import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  PackageOpen,
  ArrowLeft,
  ShieldCheck,
  Truck,
  RotateCcw,
  Gift,
  Search,
  CreditCard,
  Wallet,
  Percent,
  Tag,
  CheckCircle2,
  AlertCircle,
  Heart,
  Star,
  Zap,
  Clock,
  X,
  Info,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";

const Cart = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [selectedShipping, setSelectedShipping] = useState("standard");
  const [giftWrap, setGiftWrap] = useState(false);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const shippingCost =
    selectedShipping === "express"
      ? 15
      : selectedShipping === "priority"
        ? 25
        : 0;

  const discount = appliedPromo ? subtotal * 0.1 : 0; // 10% discount for promo
  const giftWrapCost = giftWrap ? 5 : 0;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shippingCost + giftWrapCost + tax - discount;

  const handleUpdateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateQuantity({ id, quantity: newQty }));
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart", {
      icon: "🗑️",
      style: {
        background: "#10B981",
        color: "#fff",
        borderRadius: "12px",
      },
    });
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo({ code: promoCode, discount: 10 });
      toast.success("Promo code applied! 10% discount", {
        icon: "🎉",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      setPromoCode("");
    } else {
      toast.error("Invalid promo code");
    }

    setIsApplyingPromo(false);
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    toast.success("Promo code removed");
  };

  const shippingOptions = [
    {
      id: "standard",
      name: "Standard Shipping",
      time: "5-7 days",
      cost: 0,
      icon: <Truck size={18} />,
    },
    {
      id: "express",
      name: "Express Shipping",
      time: "2-3 days",
      cost: 15,
      icon: <Zap size={18} />,
    },
    {
      id: "priority",
      name: "Priority Shipping",
      time: "1-2 days",
      cost: 25,
      icon: <Clock size={18} />,
    },
  ];

  const recommendedProducts = [
    {
      id: 1,
      name: "Wireless Earbuds Pro",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400",
      rating: 4.8,
    },
    {
      id: 2,
      name: "Smart Watch Series",
      price: 399,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
      rating: 4.9,
    },
    {
      id: 3,
      name: "Premium Headphones",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
      rating: 4.7,
    },
  ];

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full mx-auto flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-amber-600" />
            </div>
            <div className="absolute -top-2 -right-2 w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              0
            </div>
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet. Explore our
            collection and find something special.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Continue Shopping
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/wishlist"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Heart size={18} />
              View Wishlist
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-500 font-light">
                {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                in your cart
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft size={20} />
              Continue Shopping
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col sm:flex-row gap-6">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        onClick={() => handleRemove(item._id)}
                        className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <X size={14} className="text-red-500" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            to={`/product/${item._id}`}
                            className="text-lg font-medium text-gray-900 hover:text-amber-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                          <p className="text-sm text-gray-500 mt-1">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-semibold text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            ${item.price} each
                          </p>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity - 1)
                            }
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-10 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateQuantity(item._id, item.quantity + 1)
                            }
                            className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() => handleRemove(item._id)}
                          className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Recommended Products */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-8 pt-8 border-t border-gray-200"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                You Might Also Like
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl border border-gray-200 p-3 hover:shadow-lg transition-all cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-24 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-medium text-gray-900 text-sm mb-1">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-amber-600">
                        ${product.price}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-xs text-gray-500">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-medium text-gray-900 mb-6">
                  Order Summary
                </h2>

                {/* Order Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Shipping Options */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Shipping</p>
                    <div className="space-y-2">
                      {shippingOptions.map((option) => (
                        <label
                          key={option.id}
                          className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedShipping === option.id
                              ? "border-amber-500 bg-amber-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              value={option.id}
                              checked={selectedShipping === option.id}
                              onChange={(e) =>
                                setSelectedShipping(e.target.value)
                              }
                              className="hidden"
                            />
                            <div
                              className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                                selectedShipping === option.id
                                  ? "border-amber-500"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedShipping === option.id && (
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {option.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {option.time}
                                </p>
                              </div>
                            </div>
                          </div>
                          <span className="text-sm font-medium">
                            {option.cost === 0 ? "Free" : `$${option.cost}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Gift Wrap */}
                  <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={giftWrap}
                        onChange={(e) => setGiftWrap(e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <div className="flex items-center gap-2">
                        <Gift size={18} className="text-amber-600" />
                        <span className="text-sm text-gray-900">Gift Wrap</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium">$5.00</span>
                  </label>

                  {/* Promo Code */}
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Promo Code</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Enter code"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                      />
                      <button
                        onClick={handleApplyPromo}
                        disabled={isApplyingPromo}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
                      >
                        Apply
                      </button>
                    </div>
                    {appliedPromo && (
                      <div className="mt-2 flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-green-600" />
                          <span className="text-sm text-green-700">
                            {appliedPromo.code} - 10% off
                          </span>
                        </div>
                        <button
                          onClick={handleRemovePromo}
                          className="text-green-700 hover:text-green-800"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Tax */}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (8%)</span>
                    <span className="font-medium">${tax.toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-gray-200 my-4"></div>

                  {/* Total */}
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total</span>
                    <span className="text-2xl font-semibold text-gray-900">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg transition-all mb-4 flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Proceed to Checkout
                </button>

                {/* Payment Methods
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center mb-3">
                    We accept
                  </p>
                  <div className="flex justify-center gap-4">
                    <img
                      src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/visa.svg"
                      alt="Visa"
                      className="h-6"
                    />
                    <img
                      src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/mastercard.svg"
                      alt="Mastercard"
                      className="h-6"
                    />
                    <img
                      src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/amex.svg"
                      alt="Amex"
                      className="h-6"
                    />
                    <img
                      src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/paypal.svg"
                      alt="PayPal"
                      className="h-6"
                    />
                  </div>
                </div> */}

                {/* Trust Badges */}
                <div className="mt-6 flex items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <ShieldCheck size={14} />
                    <span>Secure</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center gap-1">
                    <Truck size={14} />
                    <span>Free Shipping</span>
                  </div>
                  <div className="w-px h-4 bg-gray-200"></div>
                  <div className="flex items-center gap-1">
                    <RotateCcw size={14} />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
