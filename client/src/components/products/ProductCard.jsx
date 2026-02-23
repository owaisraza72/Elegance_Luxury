import React, { useState } from "react";
import {
  Heart,
  Star,
  ShoppingCart,
  Eye,
  Share2,
  X,
  TrendingUp,
  ShieldCheck,
  Truck,
  ArrowRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { addToCart } from "../../features/cart/cartSlice";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import toast from "react-hot-toast";

/**
 * Industry-Level Luxury Product Card
 * Constructed for high-conversion and premium aesthetics.
 */
export const ProductCard = ({ product, index = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const wishlistItems = useSelector((state) => state.wishlist?.items || []);

  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  // Normalizing product data with fallbacks
  const p = {
    ...product,
    rating: product.rating || 4.5,
    reviews: product.reviewCount || 0,
    discount: product.discountPercentage || 0,
    stock: product.stock !== undefined ? product.stock : 20,
  };

  const handleWishlistAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Sign in to save items to your wishlist", {
        style: { borderRadius: "1rem", background: "#111827", color: "#fff" },
      });
      navigate("/login");
      return;
    }

    dispatch(toggleWishlist(p));
    toast.success(
      isWishlisted ? "Removed from wishlist" : "Added to your luxury wishlist",
      {
        icon: isWishlisted ? "🤍" : "❤️",
        style: { borderRadius: "1rem", background: "#111827", color: "#fff" },
      },
    );
  };

  const handleAddToCartAction = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please sign in to shop", { icon: "🔒" });
      navigate("/login");
      return;
    }

    dispatch(addToCart({ ...p, quantity: 1 }));
    toast.success(`Exclusive ${p.name} added to cart`, {
      icon: "✨",
      style: { borderRadius: "1rem", background: "#111827", color: "#fff" },
    });
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-white rounded-[2.5rem] border border-gray-100/80 shadow-sm hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-700 overflow-hidden"
      >
        <Link to={`/product/${p._id}`} className="block">
          {/* Card Media Container */}
          <div className="relative aspect-[4/5] overflow-hidden bg-gray-50/50">
            {/* Industry Level Image Handling */}
            <motion.img
              src={p.imageUrl}
              alt={p.name}
              animate={{
                scale: isHovered ? 1.08 : 1,
                filter: isHovered ? "brightness(0.9)" : "brightness(1)",
              }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full object-cover select-none"
            />

            {/* Premium Badges */}
            <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
              {p.badge && (
                <div className="px-5 py-2 bg-black/80 backdrop-blur-xl text-white text-[9px] font-black tracking-[0.25em] uppercase rounded-full shadow-2xl border border-white/10">
                  {p.badge}
                </div>
              )}
              {p.discount > 0 && (
                <div className="px-5 py-2 bg-rose-600 text-white text-[9px] font-black tracking-[0.25em] uppercase rounded-full shadow-2xl">
                  {p.discount}% OFF
                </div>
              )}
            </div>

            {/* Quick Actions Overlay */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-20"
                >
                  {/* Floating Action Buttons */}
                  <div className="absolute top-6 right-6 flex flex-col gap-3">
                    {[
                      {
                        id: "wish",
                        icon: (
                          <Heart
                            className={`w-4.5 h-4.5 ${isWishlisted ? "fill-current" : ""}`}
                          />
                        ),
                        onClick: handleWishlistAction,
                        active: isWishlisted,
                        label: "Wishlist",
                      },
                      {
                        id: "view",
                        icon: <Eye className="w-4.5 h-4.5" />,
                        onClick: (e) => {
                          e.preventDefault();
                          setShowQuickView(true);
                        },
                        label: "Quick View",
                      },
                    ].map((btn, i) => (
                      <motion.button
                        key={btn.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.4 }}
                        onClick={btn.onClick}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl border ${
                          btn.active
                            ? "bg-rose-500 text-white border-rose-500"
                            : "bg-white/95 text-gray-900 border-gray-100 hover:bg-gray-900 hover:text-white"
                        }`}
                      >
                        {btn.icon}
                      </motion.button>
                    ))}
                  </div>

                  {/* Add to Cart Premium Trigger */}
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="absolute bottom-8 left-8 right-8"
                  >
                    <button
                      onClick={handleAddToCartAction}
                      className="w-full py-5 bg-gray-900 text-white rounded-2xl font-black tracking-[0.25em] text-[10px] shadow-2xl hover:bg-amber-600 transition-all duration-500 uppercase flex items-center justify-center gap-3 active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Collection
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Default Price Tag (Hides on Hover) */}
            <AnimatePresence>
              {!isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="absolute bottom-6 right-6 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg border border-gray-100"
                >
                  <span className="text-sm font-black text-gray-900 tracking-tight">
                    ${p.price}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Product Details Section */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600">
                {p.category}
              </span>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 rounded-full border border-amber-100/50">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span className="text-[11px] font-black text-amber-700">
                  {p.rating}
                </span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-300 line-clamp-1 mb-4 font-heading tracking-tight leading-none">
              {p.name}
            </h3>

            <div className="flex items-center justify-between group/price pt-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-gray-900 tracking-tighter">
                  ${p.price}
                </span>
                {p.originalPrice && (
                  <span className="text-sm text-gray-400 line-through font-medium">
                    ${p.originalPrice}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-gray-300 group-hover/price:text-indigo-400 transition-colors">
                <ShieldCheck className="w-5 h-5" />
                <Truck className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>

      {/* Senior Level Quick View Modal */}
      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 40 }}
              className="bg-white rounded-[4rem] max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative flex flex-col md:flex-row border border-white/20"
            >
              <button
                onClick={() => setShowQuickView(false)}
                className="absolute top-10 right-10 z-50 w-14 h-14 rounded-full bg-gray-100/50 text-gray-900 backdrop-blur-md hover:bg-black hover:text-white transition-all flex items-center justify-center border border-white/20 active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="w-full md:w-[45%] h-[400px] md:h-auto relative bg-gray-50">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full h-full object-cover select-none"
                />
                <div className="absolute top-10 left-10 space-y-3">
                  {p.badge && (
                    <div className="px-6 py-2 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                      {p.badge}
                    </div>
                  )}
                  <div className="px-6 py-2 bg-white/90 backdrop-blur-md text-amber-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-100/50 flex items-center gap-2 shadow-xl">
                    <Star className="w-3 h-3 fill-current" />
                    {p.rating} Popular Choice
                  </div>
                </div>
              </div>

              <div className="w-full md:w-[55%] p-14 lg:p-20 flex flex-col justify-center">
                <div className="space-y-10">
                  <header>
                    <span className="text-sm tracking-[0.5em] uppercase text-amber-600 font-black block mb-6 px-1">
                      {p.category}
                    </span>
                    <h2 className="text-6xl font-black text-gray-900 leading-[0.95] tracking-tighter font-heading mb-6">
                      {p.name}
                    </h2>
                    <div className="flex items-baseline gap-4 mt-6">
                      <span className="text-5xl font-black text-gray-900">
                        ${p.price}
                      </span>
                      {p.originalPrice && (
                        <span className="text-2xl text-gray-300 line-through font-light">
                          ${p.originalPrice}
                        </span>
                      )}
                    </div>
                  </header>

                  <div className="space-y-6">
                    <p className="text-gray-500 font-medium leading-relaxed italic text-xl border-l-[6px] border-amber-400 pl-8 bg-amber-50/30 py-4 rounded-r-3xl">
                      "
                      {p.description ||
                        "A masterfully crafted piece for the discerning collector."}
                      "
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center gap-4 border border-gray-100">
                        <Truck className="w-8 h-8 text-indigo-500" />
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          Global Shipping
                        </div>
                      </div>
                      <div className="p-6 bg-gray-50 rounded-[2rem] flex items-center gap-4 border border-gray-100">
                        <ShieldCheck className="w-8 h-8 text-amber-500" />
                        <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                          Auth. Guaranteed
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      onClick={handleAddToCartAction}
                      className="flex-[2] py-7 bg-gray-900 text-white rounded-[2.5rem] font-black tracking-[0.3em] text-xs hover:bg-amber-600 transition-all shadow-[0_20px_40px_-5px_rgba(0,0,0,0.3)] hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-4 uppercase"
                    >
                      <ShoppingCart size={18} />
                      Procure Piece
                    </button>
                    <button
                      onClick={handleWishlistAction}
                      className={`flex-1 py-7 rounded-[2.5rem] border-2 transition-all flex items-center justify-center active:scale-95 ${
                        isWishlisted
                          ? "border-rose-500 bg-rose-50 text-rose-500 shadow-xl shadow-rose-100"
                          : "border-gray-200 hover:border-black text-gray-900"
                      }`}
                    >
                      <Heart
                        size={20}
                        className={isWishlisted ? "fill-current" : ""}
                      />
                    </button>
                  </div>

                  <button className="w-full flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 hover:text-black transition-colors group">
                    View Full Technical Details
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/**
 * Side-Drawer / Compact Version
 */
export const CompactProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group flex items-center gap-6 p-6 rounded-[2.5rem] hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 border border-transparent hover:border-gray-100"
    >
      <div className="relative w-28 h-28 rounded-[1.5rem] overflow-hidden flex-shrink-0 bg-gray-50 shadow-sm">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
      </div>
      <div className="flex-1 min-w-0 space-y-2">
        <h4 className="text-lg font-black text-gray-900 truncate group-hover:text-amber-600 transition-colors font-heading tracking-tight">
          {product.name}
        </h4>
        <div className="flex items-center gap-3">
          <p className="text-amber-600 font-black text-xl tracking-tighter">
            ${product.price}
          </p>
          <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-lg text-[10px] font-black text-gray-400">
            <Star size={10} className="fill-current" />
            {product.rating || "5.0"}
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * Premium Loading Skeleton
 */
export const ProductCardSkeleton = ({ count = 4 }) => (
  <>
    {[...Array(count)].map((_, i) => (
      <div
        key={i}
        className="rounded-[2.5rem] bg-white shadow-sm border border-gray-100 overflow-hidden animate-pulse"
      >
        <div className="aspect-[4/5] bg-gray-100" />
        <div className="p-8 space-y-6">
          <div className="flex justify-between">
            <div className="h-3 bg-gray-100 rounded w-1/4" />
            <div className="h-3 bg-gray-100 rounded w-12" />
          </div>
          <div className="h-6 bg-gray-100 rounded w-3/4" />
          <div className="flex justify-between items-center pt-4">
            <div className="h-10 bg-gray-100 rounded w-28" />
            <div className="h-5 bg-gray-100 rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </>
);

export default ProductCard;

// // Inline Styles
// const styles = `
//   @keyframes fadeInUp {
//     from {
//       opacity: 0;
//       transform: translateY(20px);
//     }
//     to {
//       opacity: 1;
//       transform: translateY(0);
//     }
//   }

//   .animate-fadeInUp {
//     animation: fadeInUp 0.5s ease-out forwards;
//   }
// `
