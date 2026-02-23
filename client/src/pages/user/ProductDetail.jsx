import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetProductQuery } from "../../features/products/productApi";
import {
  ShoppingCart,
  Heart,
  Share2,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  ArrowLeft,
  PackageSearch,
  ChevronLeft,
  ChevronRight,
  Check,
  ShoppingBag,
  Globe,
  Award,
  Zap,
  Tag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToCart } from "../../features/cart/cartSlice";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useSelector((state) => state.auth);

  const { data, isLoading, isError } = useGetProductQuery(id);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showImageZoom, setShowImageZoom] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const productImage = data?.product?.imageUrl;

  // Mock product variants
  const productVariants = [
    {
      id: 1,
      name: "Midnight Black",
      color: "#1F2937",
      price: data?.product?.price || 0,
    },
    {
      id: 2,
      name: "Arctic White",
      color: "#F3F4F6",
      price: (data?.product?.price || 0) + 50,
    },
    {
      id: 3,
      name: "Rose Gold",
      color: "#FECACA",
      price: (data?.product?.price || 0) + 100,
    },
  ];

  const handleAddToCart = (qty = quantity) => {
    if (!user) {
      toast.error("Please log in to add items to your cart");
      navigate("/login", {
        state: {
          from: `/product/${id}`,
          action: "add_to_cart",
          quantity: qty,
        },
      });
      return;
    }

    if (!data?.product) return;

    const productToAdd = {
      ...data.product,
      quantity: qty,
      variant: selectedVariant,
      price: selectedVariant?.price || data.product.price,
    };

    dispatch(addToCart(productToAdd));
    toast.success(`${data.product.name} added to cart!`, {
      icon: "🛒",
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
  };

  const handleImageZoom = (e) => {
    if (!showImageZoom) return;

    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomPosition({ x, y });
  };

  useEffect(() => {
    if (!selectedVariant && productVariants.length > 0) {
      setSelectedVariant(productVariants[0]);
    }
  }, [productVariants]);

  useEffect(() => {
    if (user && location.state?.action === "add_to_cart" && data?.product) {
      const savedQty = location.state?.quantity || 1;
      handleAddToCart(savedQty);
      window.history.replaceState({}, document.title);
    }
  }, [user, location.state, data?.product]);

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="relative">
          <div className="w-32 h-32 border-4 border-transparent rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-violet-500 p-1 animate-spin">
            <div className="w-full h-full bg-white rounded-full"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="w-8 h-8 text-amber-600 animate-pulse" />
          </div>
          <p className="mt-8 text-lg font-light text-gray-600 tracking-widest animate-pulse">
            CURATING LUXURY EXPERIENCE
          </p>
        </div>
      </div>
    );

  if (isError || !data?.product)
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="relative mb-8">
            <div className="w-48 h-48 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mx-auto flex items-center justify-center">
              <div className="absolute inset-0 border-8 border-transparent rounded-full bg-gradient-to-r from-rose-500 to-pink-500 p-1 animate-pulse">
                <div className="w-full h-full bg-white rounded-full"></div>
              </div>
              <PackageSearch className="w-16 h-16 text-rose-600 relative z-10" />
            </div>
          </div>
          <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
            Collection Unavailable
          </h2>
          <p className="text-gray-500 mb-10 leading-relaxed text-lg font-light">
            This exquisite piece is currently being curated. Please explore our
            other luxury collections.
          </p>
          <button
            onClick={() => navigate("/")}
            className="group relative px-12 py-5 bg-gradient-to-r from-gray-900 to-black text-white font-light tracking-widest rounded-full hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-3">
              EXPLORE COLLECTIONS
              <ChevronRight className="group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </div>
    );

  const { product } = data;
  const finalPrice = selectedVariant?.price || product.price;
  const discountPrice = finalPrice * 1.25;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-rose-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 text-gray-500 hover:text-gray-900 transition-colors mb-12 font-light tracking-wider"
        >
          <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-gray-300 group-hover:bg-gray-50 transition-all">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          </div>
          <span className="text-sm">BACK TO COLLECTION</span>
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          {/* Image Gallery Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Main Image Section */}
            <div className="flex justify-center">
              <div
                className="relative aspect-square w-full max-w-[500px] rounded-[3rem] overflow-hidden bg-gradient-to-br from-gray-50 to-white shadow-2xl cursor-zoom-in group"
                onMouseMove={handleImageZoom}
                onMouseEnter={() => setShowImageZoom(true)}
                onMouseLeave={() => setShowImageZoom(false)}
              >
                <img
                  src={productImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                {/* Zoom Overlay */}
                <AnimatePresence>
                  {showImageZoom && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gray-900 bg-opacity-10 backdrop-blur-sm pointer-events-none"
                      style={{
                        backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                        backgroundSize: "200%",
                        backgroundImage: `url(${productImage})`,
                      }}
                    />
                  )}
                </AnimatePresence>

                {/* Premium Badge */}
                <div className="absolute top-6 left-6">
                  <div className="px-4 py-2 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-light tracking-widest rounded-full shadow-lg">
                    LUXURY COLLECTION
                  </div>
                </div>
              </div>
            </div>

            {/* Seller Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-500/10 to-rose-500/10 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 flex items-center justify-center text-white font-light text-xl">
                      {product.seller?.name?.charAt(0) || "P"}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-light tracking-wider">
                      PREMIUM PARTNER
                    </p>
                    <h4 className="text-lg font-light text-gray-900">
                      {product.seller?.name || "Premium Partner"}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-amber-400 fill-current" />
                      <span className="text-sm text-gray-500">
                        4.9 (128 reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <button className="px-6 py-3 rounded-full border border-gray-300 text-gray-700 font-light hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  View Store
                </button>
              </div>
            </motion.div>
          </motion.div>

          {/* Product Information Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Category & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-gradient-to-r from-amber-500/10 to-rose-500/10 text-amber-700 text-xs font-light tracking-widest rounded-full border border-amber-200">
                  {product.category}
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-xs text-emerald-600 font-light">
                    In Stock
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-rose-200 hover:bg-rose-50 transition-colors"
                >
                  <Heart
                    className={`w-5 h-5 ${isWishlisted ? "text-rose-500 fill-rose-500" : "text-gray-400"}`}
                  />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
                >
                  <Share2 className="w-5 h-5 text-gray-400" />
                </motion.button>
              </div>
            </div>

            {/* Product Title */}
            <h1 className="text-5xl xl:text-6xl font-light text-gray-900 leading-[1.1] tracking-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-amber-400 fill-current"
                  />
                ))}
              </div>
              <span className="text-gray-500 font-light">
                4.8 • 124 Reviews
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed font-light max-w-2xl">
              "{product.description}"
            </p>

            {/* Variant Selection */}
            <div className="space-y-4">
              <h3 className="text-sm text-gray-500 font-light tracking-wider">
                SELECT VARIANT
              </h3>
              <div className="flex flex-wrap gap-3">
                {productVariants.map((variant) => (
                  <motion.button
                    key={variant.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 ${selectedVariant?.id === variant.id ? "border-amber-500 bg-gradient-to-r from-amber-50 to-rose-50" : "border-gray-200 hover:border-gray-300"}`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: variant.color }}
                    />
                    <span className="font-light text-gray-900">
                      {variant.name}
                    </span>
                    {selectedVariant?.id === variant.id && (
                      <Check className="w-4 h-4 text-amber-500" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Price Section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-8 bg-gradient-to-br from-white to-gray-50 rounded-3xl border border-gray-200/50 shadow-xl"
            >
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-5xl font-light text-gray-900">
                  ${finalPrice.toFixed(2)}
                </span>
                <span className="text-xl text-gray-400 line-through font-light">
                  ${discountPrice.toFixed(2)}
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-sm font-light rounded-full">
                  SAVE 25%
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-6 mb-8">
                <span className="text-sm text-gray-500 font-light tracking-wider">
                  QUANTITY
                </span>
                <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl hover:bg-white transition-colors flex items-center justify-center text-2xl font-light text-gray-600"
                  >
                    −
                  </motion.button>
                  <span className="w-12 text-center text-xl font-light text-gray-900">
                    {quantity}
                  </span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl hover:bg-white transition-colors flex items-center justify-center text-2xl font-light text-gray-600"
                  >
                    +
                  </motion.button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAddToCart()}
                  className="w-full relative py-5 bg-gradient-to-r from-gray-900 to-black text-white font-light tracking-widest rounded-2xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-4 group overflow-hidden"
                >
                  <div className="relative z-10 flex items-center gap-4">
                    <ShoppingCart className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    <span>ADD TO LUXURY CART</span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>

                <button className="w-full py-4 border-2 border-gray-300 text-gray-700 font-light tracking-widest rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition-colors">
                  BUY NOW • EXPRESS CHECKOUT
                </button>
              </div>
            </motion.div>

            {/* Premium Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Globe,
                  title: "Global Delivery",
                  desc: "150+ Countries",
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  icon: Award,
                  title: "Premium Quality",
                  desc: "Certified Luxury",
                  color: "from-amber-500 to-orange-500",
                },
                {
                  icon: Zap,
                  title: "Fast Dispatch",
                  desc: "24-48 Hours",
                  color: "from-emerald-500 to-teal-500",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 bg-white rounded-2xl border border-gray-200/50 hover:border-gray-300 transition-colors group"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4`}
                  >
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-light text-gray-900 text-lg mb-1">
                    {feature.title}
                  </h4>
                  <p className="text-sm text-gray-500 font-light">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Additional Info */}
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/50">
              <div className="flex items-center gap-4 mb-4">
                <Tag className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm text-gray-500 font-light tracking-wider">
                  PRODUCT DETAILS
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-light">Material</p>
                  <p className="font-light text-gray-900">
                    Premium Italian Leather
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-light">Weight</p>
                  <p className="font-light text-gray-900">1.2 kg</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-light">Dimensions</p>
                  <p className="font-light text-gray-900">30 × 20 × 15 cm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-light">Warranty</p>
                  <p className="font-light text-gray-900">
                    2 Years International
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
