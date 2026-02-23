import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShoppingBasket,
  Star,
  Filter,
  Search,
  Grid3x3,
  LayoutList,
  X,
  Eye,
  ChevronDown,
  Check,
  AlertCircle,
  Package,
  Clock,
  Tag,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toggleWishlist } from "../../features/wishlist/wishlistSlice";
import { addToCart } from "../../features/cart/cartSlice";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { items: wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort wishlist items
  const filteredItems = wishlistItems
    .filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category?.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.addedAt) - new Date(a.addedAt);
      }
    });

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success(`${product.name} added to cart!`, {
      icon: "🛒",
      style: {
        background: "#10B981",
        color: "#fff",
        borderRadius: "12px",
      },
    });
  };

  const handleAddAllToCart = () => {
    const itemsToAdd = selectedItems.length > 0 ? selectedItems : wishlistItems;
    itemsToAdd.forEach((item) => {
      dispatch(addToCart({ ...item, quantity: 1 }));
    });
    toast.success(`${itemsToAdd.length} items added to cart!`, {
      icon: "🎉",
      style: {
        background: "#10B981",
        color: "#fff",
      },
    });
    setSelectedItems([]);
  };

  const removeFromWishlist = (product) => {
    dispatch(toggleWishlist(product));
    toast.success(`${product.name} removed from wishlist`, {
      icon: "🗑️",
      style: {
        background: "#EF4444",
        color: "#fff",
      },
    });
  };

  const toggleSelectItem = (productId) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const selectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item._id));
    }
  };

  const wishlistStats = {
    total: wishlistItems.length,
    totalValue: wishlistItems.reduce((sum, item) => sum + item.price, 0),
    averagePrice:
      wishlistItems.length > 0
        ? (
            wishlistItems.reduce((sum, item) => sum + item.price, 0) /
            wishlistItems.length
          ).toFixed(2)
        : 0,
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full mx-auto flex items-center justify-center">
              <Heart className="w-12 h-12 text-rose-400" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              0
            </div>
          </div>

          <h2 className="text-3xl font-light text-gray-900 mb-3">
            Your Wishlist is Empty
          </h2>
          <p className="text-gray-500 mb-8">
            Start saving your favorite items and they'll appear here.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/products"
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Explore Products
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/collections"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View Collections
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-light text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-500 font-light">
                {wishlistItems.length}{" "}
                {wishlistItems.length === 1 ? "item" : "items"} saved for later
              </p>
            </div>

            {wishlistItems.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center gap-2"
              >
                <ShoppingBag size={18} />
                Add All to Cart (${wishlistStats.totalValue})
              </button>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Items</p>
              <p className="text-2xl font-semibold text-gray-900">
                {wishlistStats.total}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Total Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${wishlistStats.totalValue}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-sm text-gray-500 mb-1">Average Price</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${wishlistStats.averagePrice}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
              />
            </div>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>

              <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-3 py-3 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"}`}
                >
                  <Grid3x3 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`px-3 py-3 ${viewMode === "list" ? "bg-gray-100" : "bg-white"}`}
                >
                  <LayoutList className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {filteredItems.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedItems.length === filteredItems.length}
                  onChange={selectAll}
                  className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-gray-600">Select All</span>
              </label>

              {selectedItems.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    {selectedItems.length} selected
                  </span>
                  <button
                    onClick={handleAddAllToCart}
                    className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600"
                  >
                    Add Selected to Cart
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Wishlist Items */}
        {viewMode === "grid" ? (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((product) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all group"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.imageUrl || product.images?.[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Quick Actions */}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(product._id)}
                        onChange={() => toggleSelectItem(product._id)}
                        className="w-5 h-5 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <button
                        onClick={() => removeFromWishlist(product)}
                        className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>

                    {/* Hover Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full py-2.5 bg-white text-gray-900 rounded-lg font-medium text-sm hover:bg-amber-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <ShoppingBag size={16} />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link
                      to={`/product/${product._id}`}
                      className="text-sm font-medium text-gray-900 hover:text-amber-600 transition-colors line-clamp-1"
                    >
                      {product.name}
                    </Link>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {product.category || "Uncategorized"}
                        </span>
                      </div>
                      <p className="text-lg font-semibold text-gray-900">
                        ${product.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-3 text-xs">
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span className="text-gray-600">4.8</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600">In Stock</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* List View */
          <motion.div
            layout
            className="bg-white rounded-xl border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={selectedItems.length === filteredItems.length}
                        onChange={selectAll}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredItems.map((product) => (
                    <motion.tr
                      key={product._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(product._id)}
                          onChange={() => toggleSelectItem(product._id)}
                          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              to={`/product/${product._id}`}
                              className="font-medium text-gray-900 hover:text-amber-600"
                            >
                              {product.name}
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {product.category || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">
                          ${product.price}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-green-600 text-sm">In Stock</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(product)}
                            className="px-3 py-1.5 text-sm bg-amber-500 text-white rounded-lg hover:bg-amber-600"
                          >
                            Add to Cart
                          </button>
                          <button
                            onClick={() => removeFromWishlist(product)}
                            className="px-3 py-1.5 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty Filter State */}
        {filteredItems.length === 0 && searchTerm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center py-12"
          >
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium"
            >
              Clear Search
            </button>
          </motion.div>
        )}

        {/* Bottom CTA */}
        {wishlistItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-8 text-white text-center"
          >
            <h2 className="text-2xl font-light mb-3">
              Ready to Complete Your Collection?
            </h2>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Don't let your favorites slip away. Add them to your cart now and
              enjoy express shipping.
            </p>
            <button
              onClick={() => navigate("/cart")}
              className="px-8 py-3 bg-white text-amber-600 rounded-lg font-medium hover:shadow-lg transition-all"
            >
              View Cart
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
