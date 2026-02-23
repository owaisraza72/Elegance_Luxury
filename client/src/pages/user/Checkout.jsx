import { motion } from "framer-motion";
import {
  CreditCard,
  Truck,
  ShieldCheck,
  ArrowRight,
  Package,
  ArrowLeft,
  MapPin,
  User,
  Mail,
  Home,
  Building,
  Hash,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Smartphone,
  Wallet,
  Gift,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useCreateOrderMutation } from "../../features/orders/orderApi";
import { clearCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [currentStep, setCurrentStep] = useState(1);
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [saveAddress, setSaveAddress] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const steps = [
    { id: 1, name: "Shipping", icon: <Truck size={18} /> },
    { id: 2, name: "Payment", icon: <CreditCard size={18} /> },
    { id: 3, name: "Review", icon: <CheckCircle2 size={18} /> },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  const validateShipping = () => {
    const newErrors = {};
    if (!address.firstName.trim()) newErrors.firstName = "First name required";
    if (!address.lastName.trim()) newErrors.lastName = "Last name required";
    if (!address.email.trim()) newErrors.email = "Email required";
    if (!/^\S+@\S+\.\S+$/.test(address.email))
      newErrors.email = "Invalid email";
    if (!address.address.trim()) newErrors.address = "Address required";
    if (!address.city.trim()) newErrors.city = "City required";
    if (!address.postalCode.trim())
      newErrors.postalCode = "Postal code required";
    if (!address.phone.trim()) newErrors.phone = "Phone number required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && validateShipping()) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const orderData = {
      items: cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      shipping,
      tax,
      totalAmount: total,
      shippingAddress: address,
      paymentMethod,
      saveAddress,
    };

    try {
      await createOrder(orderData).unwrap();
      toast.success("Order placed successfully!", {
        icon: "🎉",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });
      dispatch(clearCart());
      navigate("/orders");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to place order");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-amber-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900 mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg"
          >
            Continue Shopping
            <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back to Cart</span>
          </Link>
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-light text-gray-900 mb-3">Checkout</h1>
          <p className="text-gray-500 font-light">
            Complete your purchase in a few simple steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center gap-3`}>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      currentStep >= step.id
                        ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-20 h-0.5 mx-4 ${
                      currentStep > step.id ? "bg-amber-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlaceOrder}>
              {/* Step 1: Shipping */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                    <MapPin size={20} className="text-amber-600" />
                    Shipping Address
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="firstName"
                            value={address.firstName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2.5 border ${
                              errors.firstName
                                ? "border-red-300"
                                : "border-gray-200"
                            } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                            placeholder="John"
                          />
                        </div>
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="lastName"
                            value={address.lastName}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2.5 border ${
                              errors.lastName
                                ? "border-red-300"
                                : "border-gray-200"
                            } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                            placeholder="Doe"
                          />
                        </div>
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.lastName}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="email"
                          type="email"
                          value={address.email}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2.5 border ${
                            errors.email ? "border-red-300" : "border-gray-200"
                          } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                          placeholder="john@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="phone"
                          value={address.phone}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2.5 border ${
                            errors.phone ? "border-red-300" : "border-gray-200"
                          } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address *
                      </label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="address"
                          value={address.address}
                          onChange={handleInputChange}
                          className={`w-full pl-10 pr-3 py-2.5 border ${
                            errors.address
                              ? "border-red-300"
                              : "border-gray-200"
                          } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                          placeholder="123 Main St"
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.address}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City *
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="city"
                            value={address.city}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2.5 border ${
                              errors.city ? "border-red-300" : "border-gray-200"
                            } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                            placeholder="New York"
                          />
                        </div>
                        {errors.city && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Postal Code *
                        </label>
                        <div className="relative">
                          <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="postalCode"
                            value={address.postalCode}
                            onChange={handleInputChange}
                            className={`w-full pl-10 pr-3 py-2.5 border ${
                              errors.postalCode
                                ? "border-red-300"
                                : "border-gray-200"
                            } rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none`}
                            placeholder="10001"
                          />
                        </div>
                        {errors.postalCode && (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.postalCode}
                          </p>
                        )}
                      </div>
                    </div>

                    <label className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        checked={saveAddress}
                        onChange={(e) => setSaveAddress(e.target.checked)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-600">
                        Save address for future orders
                      </span>
                    </label>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-amber-600" />
                    Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "card"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === "card"
                                ? "border-amber-500"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "card" && (
                              <div className="w-3 h-3 rounded-full bg-amber-500" />
                            )}
                          </div>
                          <CreditCard
                            className={`w-5 h-5 ${
                              paymentMethod === "card"
                                ? "text-amber-600"
                                : "text-gray-400"
                            }`}
                          />
                          <span className="font-medium">
                            Credit / Debit Card
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <img
                            src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/visa.svg"
                            alt="Visa"
                            className="h-5"
                          />
                          <img
                            src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/mastercard.svg"
                            alt="Mastercard"
                            className="h-5"
                          />
                          <img
                            src="https://cdn.jsdelivr.net/gh/alohe/emojipedia/payment-icons/amex.svg"
                            alt="Amex"
                            className="h-5"
                          />
                        </div>
                      </div>

                      {paymentMethod === "card" && (
                        <div className="mt-4 grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder="Card number"
                            className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg focus:border-amber-300 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="MM/YY"
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-amber-300 outline-none"
                          />
                          <input
                            type="text"
                            placeholder="CVC"
                            className="px-3 py-2 border border-gray-200 rounded-lg focus:border-amber-300 outline-none"
                          />
                        </div>
                      )}
                    </div>

                    <div
                      onClick={() => setPaymentMethod("paypal")}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === "paypal"
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            paymentMethod === "paypal"
                              ? "border-amber-500"
                              : "border-gray-300"
                          }`}
                        >
                          {paymentMethod === "paypal" && (
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                          )}
                        </div>
                        <Wallet
                          className={`w-5 h-5 ${
                            paymentMethod === "paypal"
                              ? "text-amber-600"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-medium">PayPal</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-2xl border border-gray-200 p-6"
                >
                  <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-amber-600" />
                    Review Order
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Shipping Address
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="font-medium">
                          {address.firstName} {address.lastName}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {address.address}
                        </p>
                        <p className="text-sm text-gray-600">
                          {address.city}, {address.postalCode}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {address.email}
                        </p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Payment Method
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          {paymentMethod === "card" ? (
                            <>
                              <CreditCard className="w-5 h-5 text-gray-600" />
                              <span>VISA ending in 4242</span>
                            </>
                          ) : (
                            <>
                              <Wallet className="w-5 h-5 text-gray-600" />
                              <span>PayPal</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-700 mb-3">
                        Order Summary
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Subtotal</span>
                          <span className="font-medium">
                            ${subtotal.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shipping</span>
                          <span className="font-medium">
                            ${shipping.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tax</span>
                          <span className="font-medium">${tax.toFixed(2)}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                          <div className="flex justify-between font-semibold">
                            <span>Total</span>
                            <span className="text-amber-600">
                              ${total.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between gap-4 mt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Place Order
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Order Summary
              </h2>

              {/* Items */}
              <div className="max-h-64 overflow-y-auto mb-4 space-y-3">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 mt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-amber-600">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-amber-600" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Checkout</p>
                    <p className="text-xs text-gray-600">
                      Your data is protected
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon */}
              <div className="mt-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-amber-300 outline-none"
                  />
                  <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
