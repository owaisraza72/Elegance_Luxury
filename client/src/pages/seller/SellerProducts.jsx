import { useState, useMemo } from "react";
import {
  useAddProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
} from "../../features/products/productApi";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit,
  X,
  Loader2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  Grid,
  List as ListIcon,
  RefreshCw,
  Box,
  TrendingUp,
  Image as ImageIcon,
  DollarSign,
  Layers,
  CheckCircle2,
  Eye,
  Clock,
  Star,
  Award,
  Copy,
  Download,
  Archive,
  ShoppingBag,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Home,
} from "lucide-react";

const SellerProducts = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { data, isLoading, isError, refetch } = useGetAllProductsQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
    stock: "",
    featured: false,
  });

  // Filter seller's products
  const sellerProducts = useMemo(() => {
    return (
      data?.products?.filter(
        (p) => p.seller?._id === user?._id || p.seller === user?._id,
      ) || []
    );
  }, [data, user?._id]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let filtered = sellerProducts.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "stock-low":
        filtered.sort((a, b) => a.stock - b.stock);
        break;
      case "stock-high":
        filtered.sort((a, b) => b.stock - a.stock);
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return filtered;
  }, [sellerProducts, searchTerm, categoryFilter, sortBy]);

  // Get unique categories
  const categories = useMemo(() => {
    return ["all", ...new Set(sellerProducts.map((p) => p.category))];
  }, [sellerProducts]);

  // Statistics
  const stats = useMemo(() => {
    const totalValue = sellerProducts.reduce(
      (sum, p) => sum + p.price * p.stock,
      0,
    );
    const lowStock = sellerProducts.filter((p) => p.stock < 10).length;
    const outOfStock = sellerProducts.filter((p) => p.stock === 0).length;
    const featured = sellerProducts.filter((p) => p.featured).length;

    return {
      total: sellerProducts.length,
      totalValue,
      lowStock,
      outOfStock,
      featured,
      avgPrice:
        sellerProducts.length > 0
          ? (
              sellerProducts.reduce((sum, p) => sum + p.price, 0) /
              sellerProducts.length
            ).toFixed(2)
          : 0,
    };
  }, [sellerProducts]);

  const handleRefresh = async () => {
    const promise = refetch();
    toast.promise(promise, {
      loading: "Syncing inventory...",
      success: "Inventory updated!",
      error: "Failed to sync.",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadToast = toast.loading("Publishing product...");
    try {
      await addProduct(form).unwrap();
      toast.success("Product listed successfully!", { id: loadToast });
      setShowAddModal(false);
      setForm({
        name: "",
        price: "",
        description: "",
        imageUrl: "",
        category: "",
        stock: "",
        featured: false,
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to list product", {
        id: loadToast,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;

    const loadToast = toast.loading("Removing product...");
    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product removed successfully", { id: loadToast });
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete product", { id: loadToast });
    }
  };

  const handleDuplicate = (product) => {
    setForm({
      name: `${product.name} (Copy)`,
      price: product.price,
      description: product.description,
      imageUrl: product.imageUrl,
      category: product.category,
      stock: product.stock,
      featured: false,
    });
    setShowAddModal(true);
    toast.success("Product details copied. Review before publishing.");
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
          LOADING YOUR COLLECTION
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-white p-10 rounded-3xl border border-red-100 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h3 className="text-2xl font-light text-gray-900 mb-3">
          Failed to Load Products
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          There was an error fetching your product data. Please try again.
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
              Product Portfolio
            </h1>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-light">
                {stats.total} Products
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="text-sm text-gray-500 font-light">
                Manage your store collection
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
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl font-medium hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Add New Product
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
      >
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.total}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inventory Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.totalValue.toLocaleString()}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Low Stock</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.lowStock}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Featured</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.featured}
              </p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Avg Price</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${stats.avgPrice}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-rose-500" />
          </div>
        </div>
      </motion.div>

      {/* Filters & Controls */}
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
              placeholder="Search products by name or description..."
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
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === "all" ? "All Categories" : c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <TrendingUp className="w-5 h-5 text-gray-400" />
              <select
                className="bg-transparent outline-none text-sm font-medium"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock-low">Stock: Low to High</option>
                <option value="stock-high">Stock: High to Low</option>
              </select>
            </div>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 ${viewMode === "grid" ? "bg-gray-100 text-amber-600" : "bg-white text-gray-400"}`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 ${viewMode === "list" ? "bg-gray-100 text-amber-600" : "bg-white text-gray-400"}`}
              >
                <ListIcon size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Products Display */}
      <AnimatePresence mode="wait">
        {filteredProducts.length > 0 ? (
          viewMode === "grid" ? (
            <motion.div
              key="grid"
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />

                    {/* Stock Badge */}
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${
                        product.stock === 0
                          ? "bg-red-100 text-red-700"
                          : product.stock < 10
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {product.stock} in stock
                    </div>

                    {/* Featured Badge */}
                    {product.featured && (
                      <div className="absolute top-3 right-3 px-2 py-1 bg-amber-500 text-white rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button
                        onClick={() =>
                          navigate(`/seller/edit-product/${product._id}`)
                        }
                        className="p-3 bg-white rounded-full hover:bg-amber-500 hover:text-white transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowDeleteConfirm(true);
                        }}
                        className="p-3 bg-white rounded-full hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDuplicate(product)}
                        className="p-3 bg-white rounded-full hover:bg-blue-500 hover:text-white transition-colors"
                      >
                        <Copy size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 line-clamp-1">
                        {product.name}
                      </h3>
                      <span className="text-lg font-semibold text-gray-900">
                        ${product.price}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">
                          {product.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star size={14} className="fill-current" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
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
                        Status
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden">
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500 line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {product.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">
                            ${product.price}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              product.stock === 0
                                ? "bg-red-100 text-red-700"
                                : product.stock < 10
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-green-100 text-green-700"
                            }`}
                          >
                            {product.stock} units
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                product.stock === 0
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              }`}
                            />
                            <span className="text-sm text-gray-600">
                              {product.stock === 0 ? "Out of Stock" : "Active"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                navigate(`/seller/edit-product/${product._id}`)
                              }
                              className="p-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedProduct(product);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDuplicate(product)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Copy size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-xl border border-gray-200 p-12 text-center"
          >
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              {searchTerm || categoryFilter !== "all"
                ? "No products match your current filters. Try adjusting your search criteria."
                : "You haven't added any products yet. Start by adding your first product."}
            </p>
            {searchTerm || categoryFilter !== "all" ? (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("all");
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all"
              >
                Add Your First Product
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                      <Plus className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        Add New Product
                      </h3>
                      <p className="text-sm text-gray-500">
                        Create a new product listing
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                      placeholder="e.g. Premium Leather Bag"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($) *
                      </label>
                      <input
                        type="number"
                        required
                        step="0.01"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                        placeholder="29.99"
                        value={form.price}
                        onChange={(e) =>
                          setForm({ ...form, price: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        required
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                        placeholder="100"
                        value={form.stock}
                        onChange={(e) =>
                          setForm({ ...form, stock: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                      placeholder="e.g. Electronics, Clothing, Accessories"
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
                      placeholder="https://example.com/image.jpg"
                      value={form.imageUrl}
                      onChange={(e) =>
                        setForm({ ...form, imageUrl: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none resize-none"
                      placeholder="Describe your product..."
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featured"
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      checked={form.featured}
                      onChange={(e) =>
                        setForm({ ...form, featured: e.target.checked })
                      }
                    />
                    <label htmlFor="featured" className="text-sm text-gray-700">
                      Mark as featured product
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50"
                    >
                      {isAdding ? (
                        <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                      ) : (
                        "Add Product"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && selectedProduct && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 text-center mb-2">
                  Delete Product
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{selectedProduct.name}</span>?
                  This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerProducts;
