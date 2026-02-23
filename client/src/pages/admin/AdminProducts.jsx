import { useState } from "react";
import {
  useGetAllProductsAdminQuery,
  useDeleteAnyProductMutation,
  useUpdateAnyProductMutation,
  useAddProductAdminMutation,
} from "../../features/admin/adminApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  X,
  Search,
  Filter,
  DollarSign,
  Package2,
  TrendingUp,
  RefreshCw,
  Eye,
  MoreVertical,
  AlertCircle,
  Image as ImageIcon,
  Tag,
  BarChart3,
  Shield,
  Loader2,
  CheckCircle,
  ArrowUpDown,
  Grid,
  List,
} from "lucide-react";

const AdminProducts = () => {
  // Queries
  const { data, isLoading, isError, refetch } = useGetAllProductsAdminQuery();
  const [addProduct, { isLoading: isAdding }] = useAddProductAdminMutation();
  const [deleteProduct, { isLoading: isDeleting }] =
    useDeleteAnyProductMutation();
  const [updateProduct, { isLoading: isUpdating }] =
    useUpdateAnyProductMutation();

  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // New Product Form
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imageUrl: "",
    featured: false,
  });

  // Edit Product Form
  const [editForm, setEditForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imageUrl: "",
    featured: false,
  });

  // Extract unique categories
  const categories = [
    "all",
    ...new Set(data?.products?.map((p) => p.category) || []),
  ];

  // Filter and sort products
  const filteredProducts =
    data?.products
      ?.filter((product) => {
        const matchesSearch =
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;
        return matchesSearch && matchesCategory;
      })
      ?.sort((a, b) => {
        switch (sortBy) {
          case "price-high":
            return b.price - a.price;
          case "price-low":
            return a.price - b.price;
          case "stock-high":
            return b.stock - a.stock;
          case "stock-low":
            return a.stock - b.stock;
          default:
            return new Date(b.createdAt) - new Date(a.createdAt);
        }
      }) || [];

  // Stats
  const productStats = {
    total: data?.products?.length || 0,
    lowStock: data?.products?.filter((p) => p.stock < 10).length || 0,
    outOfStock: data?.products?.filter((p) => p.stock === 0).length || 0,
    averagePrice:
      data?.products?.length > 0
        ? (
            data.products.reduce((sum, p) => sum + p.price, 0) /
            data.products.length
          ).toFixed(2)
        : 0,
  };

  // Handlers
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Adding product...");

    try {
      await addProduct({
        ...newProduct,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
      }).unwrap();

      toast.success("Product added successfully", { id: toastId });
      setShowAddModal(false);
      setNewProduct({
        name: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        imageUrl: "",
        featured: false,
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add product", {
        id: toastId,
      });
    }
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      category: product.category,
      description: product.description,
      imageUrl: product.imageUrl,
      featured: product.featured || false,
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Updating product...");

    try {
      await updateProduct({
        id: selectedProduct._id,
        data: {
          ...editForm,
          price: parseFloat(editForm.price),
          stock: parseInt(editForm.stock),
        },
      }).unwrap();

      toast.success("Product updated successfully", { id: toastId });
      setShowEditModal(false);
      setSelectedProduct(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product", {
        id: toastId,
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    const toastId = toast.loading("Deleting product...");

    try {
      await deleteProduct(selectedProduct._id).unwrap();
      toast.success("Product deleted successfully", { id: toastId });
      setShowDeleteModal(false);
      setSelectedProduct(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete product", {
        id: toastId,
      });
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-3 border-gray-200 border-t-amber-500 rounded-full mb-4"
        />
        <p className="text-gray-500 font-light">Loading products...</p>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border border-red-100 text-center"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Unable to Load Products
        </h3>
        <p className="text-gray-600 mb-6">
          There was an error fetching product data.
        </p>
        <button
          onClick={refetch}
          className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium hover:shadow-lg"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              Product Management
            </h1>
            <p className="text-gray-500 font-light">
              Manage and monitor all products ({productStats.total} total)
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg"
          >
            <Plus size={18} />
            Add New Product
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {productStats.total}
                </p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Low Stock (&lt; 10)</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {productStats.lowStock}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {productStats.outOfStock}
                </p>
              </div>
              <X className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Price</p>
                <p className="text-2xl font-semibold text-gray-900">
                  ${productStats.averagePrice}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
            />
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium"
              >
                <option value="all">All Categories</option>
                {categories.slice(1).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg">
              <ArrowUpDown className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium"
              >
                <option value="newest">Newest</option>
                <option value="price-high">Price: High to Low</option>
                <option value="price-low">Price: Low to High</option>
                <option value="stock-high">Stock: High to Low</option>
                <option value="stock-low">Stock: Low to High</option>
              </select>
            </div>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2.5 ${viewMode === "grid" ? "bg-gray-100" : "bg-white"}`}
              >
                <Grid className="w-5 h-5 text-gray-400" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2.5 ${viewMode === "list" ? "bg-gray-100" : "bg-white"}`}
              >
                <List className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <button
              onClick={refetch}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Products Grid/List */}
      {viewMode === "grid" ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Product Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                {product.featured && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                  <button
                    onClick={() => handleOpenEdit(product)}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-gray-100"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setShowDeleteModal(true);
                    }}
                    className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
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

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{product.category}</span>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.stock === 0
                        ? "bg-red-100 text-red-700"
                        : product.stock < 10
                          ? "bg-amber-100 text-amber-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    Stock: {product.stock}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowDeleteModal(true);
                          }}
                          className="px-3 py-1.5 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                        >
                          Delete
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

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-12 text-center py-20"
        >
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("all");
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium"
          >
            Clear Filters
          </button>
        </motion.div>
      )}

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <Modal
            title="Add New Product"
            icon={<Plus size={24} />}
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddProduct}
            isSubmitting={isAdding}
          >
            <ProductForm product={newProduct} onChange={setNewProduct} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {showEditModal && (
          <Modal
            title="Edit Product"
            icon={<Edit2 size={24} />}
            onClose={() => {
              setShowEditModal(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleUpdateProduct}
            isSubmitting={isUpdating}
            submitText="Update Product"
          >
            <ProductForm product={editForm} onChange={setEditForm} />
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center">
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
                      setShowDeleteModal(false);
                      setSelectedProduct(null);
                    }}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteProduct}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : (
                      "Delete Product"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Reusable Modal Component
const Modal = ({
  title,
  icon,
  children,
  onClose,
  onSubmit,
  isSubmitting,
  submitText = "Add Product",
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    onClick={onClose}
  >
    <motion.form
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      onSubmit={onSubmit}
      className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center">
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">
                Fill in the product details
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {children}

        <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
            ) : (
              submitText
            )}
          </button>
        </div>
      </div>
    </motion.form>
  </motion.div>
);

// Reusable Product Form Component
const ProductForm = ({ product, onChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Name *
      </label>
      <input
        type="text"
        value={product.name}
        onChange={(e) => onChange({ ...product, name: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
        placeholder="Product name"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Price ($) *
      </label>
      <input
        type="number"
        step="0.01"
        value={product.price}
        onChange={(e) => onChange({ ...product, price: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
        placeholder="29.99"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Stock *
      </label>
      <input
        type="number"
        value={product.stock}
        onChange={(e) => onChange({ ...product, stock: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
        placeholder="100"
        required
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Category *
      </label>
      <input
        type="text"
        value={product.category}
        onChange={(e) => onChange({ ...product, category: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
        placeholder="Electronics, Clothing, etc."
        required
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Image URL *
      </label>
      <input
        type="url"
        value={product.imageUrl}
        onChange={(e) => onChange({ ...product, imageUrl: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none"
        placeholder="https://example.com/image.jpg"
        required
      />
    </div>

    <div className="md:col-span-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Description *
      </label>
      <textarea
        value={product.description}
        onChange={(e) => onChange({ ...product, description: e.target.value })}
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none min-h-[120px]"
        placeholder="Product description..."
        required
      />
    </div>

    <div className="md:col-span-2">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={product.featured}
          onChange={(e) => onChange({ ...product, featured: e.target.checked })}
          className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
        />
        <span className="text-sm text-gray-700">Mark as featured product</span>
      </label>
    </div>
  </div>
);

export default AdminProducts;
