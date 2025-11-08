"use client";

import { motion } from "framer-motion";
import { TrendingUp, Shield, AlertCircle } from "lucide-react";

interface SafetyChartProps {
  stats: {
    todayScans: number;
    safeToday: number;
    riskyToday: number;
  } | null;
}

export default function SafetyChart({ stats }: SafetyChartProps) {
  const safeCount = stats?.safeToday || 0;
  const riskyCount = stats?.riskyToday || 0;
  const total = safeCount + riskyCount;
  const safePercentage = total > 0 ? (safeCount / total) * 100 : 0;
  const riskyPercentage = total > 0 ? (riskyCount / total) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Today's Overview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-mint-100 rounded-lg">
            <TrendingUp className="w-5 h-5 text-mint-600" />
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900">
              Today's Overview
            </h3>
            <p className="text-xs text-gray-500">Safe vs Risky items</p>
          </div>
        </div>

        {/* Circular Progress Chart */}
        <div className="flex flex-col items-center mb-6">
          <div className="relative w-48 h-48">
            {/* Background circle */}
            <svg className="transform -rotate-90 w-48 h-48">
              <circle
                cx="96"
                cy="96"
                r="88"
                stroke="#f3f4f6"
                strokeWidth="16"
                fill="none"
              />
              {/* Safe items arc (green) */}
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#greenGradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 552" }}
                animate={{
                  strokeDasharray: `${(safePercentage / 100) * 552} 552`,
                }}
                transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              />
              {/* Risky items arc (amber) */}
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                stroke="url(#amberGradient)"
                strokeWidth="16"
                fill="none"
                strokeLinecap="round"
                initial={{
                  strokeDasharray: "0 552",
                  strokeDashoffset: 0,
                }}
                animate={{
                  strokeDasharray: `${(riskyPercentage / 100) * 552} 552`,
                  strokeDashoffset: -((safePercentage / 100) * 552),
                }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4ade80" />
                  <stop offset="100%" stopColor="#22c55e" />
                </linearGradient>
                <linearGradient id="amberGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, type: "spring" }}
                className="text-center"
              >
                <div className="text-4xl font-display font-bold text-gray-900">
                  {total}
                </div>
                <div className="text-sm text-gray-500">Total Scans</div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="font-semibold text-green-900">Safe Items</div>
                <div className="text-xs text-green-600">Looking good!</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-700">
                {safeCount}
              </div>
              <div className="text-xs text-green-600">
                {Math.round(safePercentage)}%
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between p-3 bg-amber-50 rounded-xl border border-amber-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <AlertCircle className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="font-semibold text-amber-900">Risky Items</div>
                <div className="text-xs text-amber-600">Be careful</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-700">
                {riskyCount}
              </div>
              <div className="text-xs text-amber-600">
                {Math.round(riskyPercentage)}%
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Quick Tips Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-gradient-to-br from-mint-500 to-mint-600 rounded-3xl shadow-lg p-6 text-white"
      >
        <h3 className="font-display font-bold text-lg mb-2">
          🎯 Daily Tip
        </h3>
        <p className="text-sm text-mint-50 leading-relaxed">
          You're doing great! {safePercentage > 70 ? "Keep up the healthy choices! 🌟" : "Try to scan more items before purchasing to make informed decisions."}
        </p>
      </motion.div>
    </div>
  );
}

