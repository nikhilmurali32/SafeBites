"use client";

import { motion } from "framer-motion";
import { X, AlertCircle, CheckCircle, Info, ShoppingBag } from "lucide-react";

interface Ingredient {
  id: string;
  name: string;
  status: "safe" | "moderate" | "risky";
  category: string;
  description: string;
  products: string[];
}

interface IngredientModalProps {
  ingredient: Ingredient;
  onClose: () => void;
}

export default function IngredientModal({ ingredient, onClose }: IngredientModalProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "safe":
        return {
          icon: CheckCircle,
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          badge: "bg-green-100 text-green-700",
        };
      case "moderate":
        return {
          icon: AlertCircle,
          color: "text-yellow-600",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          badge: "bg-yellow-100 text-yellow-700",
        };
      case "risky":
        return {
          icon: AlertCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          badge: "bg-red-100 text-red-700",
        };
      default:
        return {
          icon: Info,
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          badge: "bg-gray-100 text-gray-700",
        };
    }
  };

  const config = getStatusConfig(ingredient.status);
  const Icon = config.icon;

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 ${config.bg} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${config.color}`} />
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${config.badge}`}>
                  {ingredient.status.charAt(0).toUpperCase() + ingredient.status.slice(1)}
                </span>
              </div>
              <h2 className="text-3xl font-display font-bold text-gray-900">
                {ingredient.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">{ingredient.category}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-600" />
            </motion.button>
          </div>

          {/* AI Summary Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${config.bg} border ${config.border} rounded-2xl p-5 mb-6`}
          >
            <div className="flex items-start gap-3">
              <div className={`p-2 ${config.badge} rounded-lg flex-shrink-0`}>
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Summary</h3>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {ingredient.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Safety Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-5 mb-6"
          >
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Icon className={`w-5 h-5 ${config.color}`} />
              Safety Information
            </h3>
            <div className="space-y-2 text-sm text-gray-700">
              {ingredient.status === "safe" && (
                <>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Generally recognized as safe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Approved by major health agencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>No known major health concerns</span>
                  </div>
                </>
              )}
              {ingredient.status === "moderate" && (
                <>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span>Some concerns reported</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span>Safe in moderation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span>May cause sensitivity in some people</span>
                  </div>
                </>
              )}
              {ingredient.status === "risky" && (
                <>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Linked to health concerns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Avoid when possible</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Restricted or banned in some countries</span>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* Products Containing This Ingredient */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border-2 border-gray-200 p-5"
          >
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-600" />
              Found in {ingredient.products.length} Products
            </h3>
            <div className="space-y-2">
              {ingredient.products.map((product, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-xl">📦</span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">
                    {product}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-6 flex gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-purple-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:bg-purple-700 transition-colors"
            >
              Add to Watchlist
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-white text-gray-700 font-semibold py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 transition-colors"
            >
              Learn More
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

