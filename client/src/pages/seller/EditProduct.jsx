import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductQuery,
  useUpdateProductMutation,
} from "../../features/products/productApi";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  Tag,
  DollarSign,
  Image as ImageIcon,
  Layers,
  Boxes,
  Save,
  ArrowLeft,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Edit3,
  Sparkles,
  Shield,
  TrendingUp,
  Camera,
  X,
  Plus,
  Minus,
  Info,
  HelpCircle,
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: productData, isLoading: isFetching } = useGetProductQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
    category: "",
    stock: "",
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    if (productData?.product) {
      const { name, price, description, imageUrl, category, stock } =
        productData.product;
      setForm({ name, price, description, imageUrl, category, stock });
      setImagePreview(imageUrl);
    }
  }, [productData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Product name is required";
    if (!form.price || form.price <= 0)
      newErrors.price = "Valid price is required";
    if (!form.stock || form.stock < 0)
      newErrors.stock = "Valid stock is required";
    if (!form.category.trim()) newErrors.category = "Category is required";
    if (!form.description.trim())
      newErrors.description = "Description is required";
    if (!form.imageUrl.trim()) newErrors.imageUrl = "Image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    const loadToast = toast.loading("Updating product...");

    try {
      await updateProduct({
        id,
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
      }).unwrap();

      toast.success("Product updated successfully!", {
        id: loadToast,
        icon: "🎉",
      });

      setTimeout(() => {
        navigate("/seller/products");
      }, 1000);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product", {
        id: loadToast,
      });
    }
  };

  const handleImageError = () => {
    setImagePreview(null);
  };

  const handleImageLoad = () => {
    setImagePreview(form.imageUrl);
  };

  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-gray-200 border-t-amber-500 rounded-full mb-6"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-500 font-light tracking-wider"
        >
          Loading product details...
        </motion.p>
      </div>
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
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-colors group"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back to Products</span>
          </button>
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
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Edit3 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-light text-gray-900">
                Edit Product
              </h1>
              <p className="text-gray-500 font-light mt-1">
                Update your product details and information
              </p>
            </div>
          </motion.div>

          {/* Tabs */}
          <motion.div
            variants={itemVariants}
            className="flex gap-2 border-b border-gray-200"
          >
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "basic"
                  ? "text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Basic Information
              {activeTab === "basic" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("media")}
              className={`px-6 py-3 font-medium text-sm transition-colors relative ${
                activeTab === "media"
                  ? "text-amber-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Media & Images
              {activeTab === "media" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500"
                />
              )}
            </button>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <AnimatePresence mode="wait">
                {activeTab === "basic" && (
                  <motion.div
                    key="basic"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Basic Information
                    </h2>

                    {/* Product Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border ${
                            errors.name ? "border-red-300" : "border-gray-200"
                          } rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all`}
                          placeholder="Premium Wireless Headphones"
                        />
                      </div>
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Price & Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price ($) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="price"
                            type="number"
                            step="0.01"
                            min="0"
                            value={form.price}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-3.5 bg-white border ${
                              errors.price
                                ? "border-red-300"
                                : "border-gray-200"
                            } rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all`}
                            placeholder="99.99"
                          />
                        </div>
                        {errors.price && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Boxes className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            name="stock"
                            type="number"
                            min="0"
                            value={form.stock}
                            onChange={handleChange}
                            className={`w-full pl-12 pr-4 py-3.5 bg-white border ${
                              errors.stock
                                ? "border-red-300"
                                : "border-gray-200"
                            } rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all`}
                            placeholder="100"
                          />
                        </div>
                        {errors.stock && (
                          <p className="mt-1 text-sm text-red-500">
                            {errors.stock}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="category"
                          type="text"
                          value={form.category}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border ${
                            errors.category
                              ? "border-red-300"
                              : "border-gray-200"
                          } rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all`}
                          placeholder="Electronics, Fashion, etc."
                        />
                      </div>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-5 w-5 h-5 text-gray-400" />
                        <textarea
                          name="description"
                          rows="5"
                          value={form.description}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-4 bg-white border ${
                            errors.description
                              ? "border-red-300"
                              : "border-gray-200"
                          } rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all resize-none`}
                          placeholder="Describe your product in detail..."
                        />
                      </div>
                      {errors.description && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Media Section */}
                {activeTab === "media" && (
                  <motion.div
                    key="media"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6"
                  >
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Product Media
                    </h2>

                    {/* Image URL */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          name="imageUrl"
                          type="url"
                          value={form.imageUrl}
                          onChange={handleChange}
                          className={`w-full pl-12 pr-4 py-3.5 bg-white border ${
                            errors.imageUrl
                              ? "border-red-300"
                              : "border-gray-200"
                          } rounded-xl focus:border-amber-300 focus:ring-2 focus:ring-amber-100 outline-none transition-all`}
                          placeholder="https://example.com/image.jpg"
                        />
                      </div>
                      {errors.imageUrl && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.imageUrl}
                        </p>
                      )}
                    </div>

                    {/* Image Preview */}
                    {form.imageUrl && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700 mb-3">
                          Preview
                        </p>
                        <div className="relative aspect-video rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                          <img
                            src={form.imageUrl}
                            alt="Preview"
                            onError={handleImageError}
                            onLoad={handleImageLoad}
                            className="w-full h-full object-cover"
                          />
                          {!imagePreview && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">
                                  Invalid image URL
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Upload Option */}
                    <div className="mt-6 p-4 border-2 border-dashed border-gray-200 rounded-xl">
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600 mb-1">
                          Upload from computer
                        </p>
                        <p className="text-xs text-gray-400 mb-3">
                          Supported: JPG, PNG, WebP
                        </p>
                        <button
                          type="button"
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200"
                        >
                          Choose File
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-xl hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Product...
                    </>
                  ) : (
                    <>
                      <Save size={20} />
                      Save Changes
                    </>
                  )}
                </button>
              </motion.div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EditProduct;
