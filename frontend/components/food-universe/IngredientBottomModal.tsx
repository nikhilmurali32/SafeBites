"use client";

import { motion } from "framer-motion";
import { X, Sparkles, TrendingUp, AlertCircle } from "lucide-react";

interface IngredientBottomModalProps {
  ingredient: any;
  onClose: () => void;
}

export default function IngredientBottomModal({ ingredient, onClose }: IngredientBottomModalProps) {
  const getStatusConfig = (safety: string) => {
    switch (safety) {
      case "safe":
        return {
          color: "text-green-400",
          bg: "bg-green-500/20",
          border: "border-green-500/30",
          icon: "✓",
        };
      case "moderate":
        return {
          color: "text-yellow-400",
          bg: "bg-yellow-500/20",
          border: "border-yellow-500/30",
          icon: "!",
        };
      case "avoid":
        return {
          color: "text-red-400",
          bg: "bg-red-500/20",
          border: "border-red-500/30",
          icon: "✕",
        };
      default:
        return {
          color: "text-gray-400",
          bg: "bg-gray-500/20",
          border: "border-gray-500/30",
          icon: "?",
        };
    }
  };

  const config = getStatusConfig(ingredient.safety);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      {/* Modal */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 bg-gradient-to-b from-slate-800 to-slate-900 rounded-t-3xl shadow-2xl z-50 max-h-[80vh] overflow-y-auto border-t-2 border-white/10"
      >
        <div className="p-6">
          {/* Handle bar */}
          <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6"></div>

          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className={`w-12 h-12 ${config.bg} ${config.color} rounded-xl flex items-center justify-center text-2xl font-bold border ${config.border}`}
                >
                  {config.icon}
                </motion.div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white">
                    {ingredient.name}
                  </h2>
                  <p className="text-indigo-300 text-sm">{ingredient.category}</p>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-white/10"
          >
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <span className="font-semibold">
                Scanned <span className={config.color}>{ingredient.scannedThisWeek}</span> times this week
              </span>
            </div>
            <div className="mt-2 text-sm text-indigo-300">
              Total encounters: {ingredient.frequency}x
            </div>
          </motion.div>

          {/* AI Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">AI Summary</h3>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm bg-white/5 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              {ingredient.summary}
            </p>
          </motion.div>

          {/* Alternatives */}
          {ingredient.alternatives && ingredient.alternatives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Suggested Alternatives</h3>
              </div>
              <div className="space-y-2">
                {ingredient.alternatives.map((alt: string, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-green-500/10 backdrop-blur-sm rounded-xl border border-green-500/20 hover:border-green-500/40 transition-colors group cursor-pointer"
                  >
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <span className="text-lg">🌿</span>
                    </div>
                    <span className="text-green-100 font-medium">Try {alt} instead</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Action Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Learn More About This Ingredient
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}

