import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useGetAllProductsQuery } from "../../features/products/productApi";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import {
  ProductCard,
  ProductCardSkeleton,
} from "../../components/products/ProductCard";
import {
  Sparkles,
  Filter,
  X,
  ChevronDown,
  Grid3x3,
  List,
  SlidersHorizontal,
  Search,
  Package,
  Star,
} from "lucide-react";

const AllProducts = () => {
  const { data, isLoading, isError } = useGetAllProductsQuery();
  const location = useLocation();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [showInStockOnly, setShowInStockOnly] = useState(false);

  // Initialize search from URL if present
  const [searchQuery, setSearchQuery] = useState(
    new URLSearchParams(location.search).get("search") || "",
  );

  // Update search query when URL param changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("search");
    if (q !== null) setSearchQuery(q);
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;

  const categories = [
    "All",
    ...new Set(data?.products?.map((p) => p.category)),
  ];

  const filteredProducts = data?.products
    ?.filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];
      const matchesRating =
        selectedRating === 0 || product.rating >= selectedRating;
      const matchesStock = !showInStockOnly || product.inStock;

      return (
        matchesCategory &&
        matchesSearch &&
        matchesPrice &&
        matchesRating &&
        matchesStock
      );
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      return 0;
    });

  const clearFilters = () => {
    setSelectedCategory("All");
    setSortBy("featured");
    setPriceRange([0, 5000]);
    setSearchQuery("");
    setSelectedRating(0);
    setShowInStockOnly(false);
  };

  const activeFiltersCount =
    (selectedCategory !== "All" ? 1 : 0) +
    (sortBy !== "featured" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 5000 ? 1 : 0) +
    (selectedRating !== 0 ? 1 : 0) +
    (showInStockOnly ? 1 : 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-amber-50/20">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-amber-600 to-rose-600 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[150px] animate-pulse" />
          <div
            className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-rose-500/10 rounded-full blur-[150px] animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 mb-8 animate-fadeIn">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-xs font-light text-white tracking-[0.25em] uppercase">
              Premium Collection
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-light text-white mb-6 tracking-tight animate-fadeInUp">
            Discover{" "}
            <span className="italic font-serif bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">
              Luxury
            </span>
          </h1>

          <p
            className="text-gray-400 max-w-2xl mx-auto font-light text-lg leading-relaxed mb-8 animate-fadeInUp"
            style={{ animationDelay: "0.2s" }}
          >
            Explore our curated catalog of exclusive products crafted by the
            world's most talented designers
          </p>

          {/* Search Bar */}
          <div
            className="max-w-2xl mx-auto animate-fadeInUp"
            style={{ animationDelay: "0.3s" }}
          >
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, categories..."
                className="w-full pl-14 pr-5 py-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="relative -mt-10 z-20">
        <div className="max-w-7xl mx-auto px-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 mb-8 animate-slideUp">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              {/* Left Section */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Package className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-light text-gray-600">
                    {filteredProducts?.length}{" "}
                    {filteredProducts?.length === 1 ? "Product" : "Products"}
                  </span>
                </div>

                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-full hover:bg-rose-100 transition-colors text-sm font-light"
                  >
                    <X className="w-4 h-4" />
                    Clear {activeFiltersCount}{" "}
                    {activeFiltersCount === 1 ? "Filter" : "Filters"}
                  </button>
                )}
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "grid"
                        ? "bg-white shadow-md text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <Grid3x3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                      viewMode === "list"
                        ? "bg-white shadow-md text-gray-900"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-700 font-light focus:outline-none focus:ring-2 focus:ring-amber-500/50 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                {/* Filter Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-light"
                >
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters
                  {activeFiltersCount > 0 && (
                    <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fadeIn">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Category
                  </label>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 ${
                          selectedCategory === cat
                            ? "bg-gradient-to-r from-amber-600 to-rose-600 text-white shadow-lg"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Price Range: ${priceRange[0]} - ${priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([0, parseInt(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>$0</span>
                    <span>$5,000</span>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Minimum Rating
                  </label>
                  <div className="space-y-2">
                    {[4.5, 4.0, 3.5, 0].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(rating)}
                        className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                          selectedRating === rating
                            ? "bg-amber-50 text-amber-700 border-2 border-amber-200"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {rating > 0 ? `${rating}+ Stars` : "All Ratings"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stock Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Availability
                  </label>
                  <button
                    onClick={() => setShowInStockOnly(!showInStockOnly)}
                    className={`w-full text-left px-4 py-2 rounded-xl transition-all duration-300 flex items-center justify-between ${
                      showInStockOnly
                        ? "bg-green-50 text-green-700 border-2 border-green-200"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span>In Stock Only</span>
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        showInStockOnly
                          ? "bg-green-600 border-green-600"
                          : "border-gray-300"
                      }`}
                    >
                      {showInStockOnly && (
                        <div className="w-2 h-2 bg-white rounded-sm" />
                      )}
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {filteredProducts?.map((product, index) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredProducts?.length === 0 && (
            <div className="text-center py-20 animate-fadeIn">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-100 to-rose-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-amber-600" />
              </div>
              <h3 className="text-2xl font-light text-gray-900 mb-3">
                No Products Found
              </h3>
              <p className="text-gray-500 mb-6 font-light">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={clearFilters}
                className="px-8 py-3 bg-gradient-to-r from-amber-600 to-rose-600 text-white rounded-full hover:shadow-xl transition-all duration-300 font-light tracking-wider"
              >
                CLEAR ALL FILTERS
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.6s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-slideUp { animation: slideUp 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default AllProducts;
