"use client";

import { motion } from "framer-motion";
import { X, TrendingUp, Activity, Award } from "lucide-react";

interface UserStatsModalProps {
  userData: {
    name: string;
    totalScans: number;
    uniqueIngredients: number;
    thisWeek: number;
  };
  onClose: () => void;
}

export default function UserStatsModal({ userData, onClose }: UserStatsModalProps) {
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl shadow-2xl z-50 border-2 border-white/20"
      >
        <div className="p-8">
          {/* Close button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </motion.button>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl shadow-lg"
            >
              👋
            </motion.div>
            <h2 className="text-3xl font-display font-bold text-white mb-2">
              {userData.name}'s Universe
            </h2>
            <p className="text-indigo-200">Your ingredient journey so far</p>
          </motion.div>

          {/* Stats Grid */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Total Scans</p>
                  <p className="text-3xl font-bold text-white">{userData.totalScans}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Unique Ingredients</p>
                  <p className="text-3xl font-bold text-white">{userData.uniqueIngredients}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                  <Award className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-gray-300 text-sm">Scans This Week</p>
                  <p className="text-3xl font-bold text-white">{userData.thisWeek}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Achievement Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-4 border border-yellow-500/30 text-center"
          >
            <p className="text-yellow-200 text-sm font-semibold">🏆 Health Explorer</p>
            <p className="text-yellow-100/60 text-xs mt-1">
              Keep scanning to discover more ingredients!
            </p>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}

