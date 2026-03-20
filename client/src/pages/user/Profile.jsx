import { useState } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { useUpdateProfileMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Shield,
  Calendar,
  MapPin,
  Edit2,
  Package,
  Heart,
  Settings,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  Award,
  ShoppingBag,
  Star,
  ChevronRight,
  Phone,
  Globe,
  Lock,
  Gift,
  TrendingUp,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import {
  X,
  Camera,
  Loader2,
} from "lucide-react";

const EditProfileModal = ({ isOpen, onClose, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    gender: user?.gender || "male",
    age: user?.age || "",
    about: user?.about || "",
    photoURL: user?.photoURL || "",
  });

  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-light text-gray-900">Edit Profile</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                    placeholder="Enter your name"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min="18"
                      max="120"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      placeholder="Age"
                    />
                  </div>
                </div>

                {/* About */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    About Me
                  </label>
                  <textarea
                    rows="3"
                    value={formData.about}
                    onChange={(e) =>
                      setFormData({ ...formData, about: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Photo URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Photo URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      value={formData.photoURL}
                      onChange={(e) =>
                        setFormData({ ...formData, photoURL: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all outline-none"
                      placeholder="https://example.com/photo.jpg"
                    />
                    <Camera
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-6 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-3 border-gray-200 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  const stats = [
    {
      icon: <ShoppingBag size={20} />,
      label: "Orders",
      value: "12",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: <Heart size={20} />,
      label: "Wishlist",
      value: "8",
      color: "bg-rose-100 text-rose-600",
    },
    {
      icon: <Star size={20} />,
      label: "Reviews",
      value: "24",
      color: "bg-amber-100 text-amber-600",
    },
    {
      icon: <Award size={20} />,
      label: "Loyalty Points",
      value: "1,240",
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const quickLinks = [
    {
      icon: <ShoppingBag size={20} />,
      label: "My Orders",
      path: "/orders",
      description: "View order history & track shipments",
    },
    {
      icon: <Heart size={20} />,
      label: "Wishlist",
      path: "/wishlist",
      description: "Saved items for later",
    },
    {
      icon: <MapPin size={20} />,
      label: "Addresses",
      path: "/addresses",
      description: "Manage shipping addresses",
    },
    {
      icon: <CreditCard size={20} />,
      label: "Payment Methods",
      path: "/payments",
      description: "Saved cards & wallets",
    },
    {
      icon: <Settings size={20} />,
      label: "Settings",
      path: "/settings",
      description: "Privacy & preferences",
    },
    {
      icon: <HelpCircle size={20} />,
      label: "Help Center",
      path: "/help",
      description: "Get support & FAQs",
    },
  ];

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
        {/* Profile Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-rose-500/10 rounded-3xl blur-3xl" />

            <div className="relative bg-white rounded-3xl border border-gray-200 p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30">
                    <span className="text-4xl font-bold text-white">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsEditModalOpen(true)}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-lg hover:shadow-xl"
                  >
                    <Edit2 size={16} className="text-gray-600" />
                  </motion.button>
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <h1 className="text-3xl font-light text-gray-900 capitalize">
                        {user.name}
                      </h1>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="px-3 py-1 bg-gradient-to-r from-amber-100 to-rose-100 text-amber-700 rounded-full text-sm font-medium">
                          {user.role.charAt(0).toUpperCase() +
                            user.role.slice(1)}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Calendar size={14} />
                          Joined{" "}
                          {new Date(user.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setIsEditModalOpen(true)}
                      className="px-6 py-2.5 bg-gradient-to-r from-gray-900 to-black text-white rounded-lg font-medium hover:shadow-lg"
                    >
                      Edit Profile
                    </motion.button>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={16} />
                        <span>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Links Section */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                onClick={() => navigate(link.path)}
                className="cursor-pointer bg-white rounded-2xl border border-gray-100 p-5 hover:border-amber-200 hover:shadow-xl transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-amber-50 transition-colors">
                    <div className="text-gray-400 group-hover:text-amber-500 transition-colors">
                      {link.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900 group-hover:text-amber-600 transition-colors">
                        {link.label}
                      </h3>
                      <ChevronRight
                        size={16}
                        className="text-gray-300 group-hover:text-amber-400"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                      {link.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Account Details */}
          <motion.div
            variants={itemVariants}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h2 className="text-lg font-light text-gray-900">
                Account Details
              </h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Personal Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <User size={18} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {user.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Mail size={18} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email Address</p>
                          <p className="font-medium text-gray-900">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {user.age && user.gender && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <User size={18} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Age & Gender
                            </p>
                            <p className="font-medium text-gray-900 capitalize">
                              {user.age} years, {user.gender}
                            </p>
                          </div>
                        </div>
                      )}

                      {user.phone && (
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Phone size={18} className="text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">
                              Phone Number
                            </p>
                            <p className="font-medium text-gray-900">
                              {user.phone}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account & Security */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                      Account & Security
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Shield size={18} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Account Type</p>
                          <p className="font-medium text-gray-900 capitalize">
                            {user.role}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Lock size={18} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Password</p>
                          <p className="font-medium text-gray-900">••••••••</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Globe size={18} className="text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Language</p>
                          <p className="font-medium text-gray-900">English</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {user.about && (
                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                    About Me
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-600 italic">"{user.about}"</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/settings")}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <Settings size={18} />
              Account Settings
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/support")}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <HelpCircle size={18} />
              Get Help
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Profile;
