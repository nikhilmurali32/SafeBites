"use client";

import { motion } from "framer-motion";
import { TrendingUp, Shield, AlertCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface SafetyChartProps {
  stats: {
    todayScans: number;
    safeToday: number;
    riskyToday: number;
  } | null;
}

type TimeRange = "today" | "week" | "month" | "overall";

const mockStats = {
  today: { safe: 3, risky: 1, total: 4 },
  week: { safe: 8, risky: 3, total: 11 },
  month: { safe: 32, risky: 12, total: 44 },
  overall: { safe: 64, risky: 23, total: 87 },
};

export default function SafetyChart({ stats }: SafetyChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [showDropdown, setShowDropdown] = useState(false);

  const currentStats = mockStats[timeRange];
  const safeCount = currentStats.safe;
  const riskyCount = currentStats.risky;
  const total = currentStats.total;
  const safePercentage = total > 0 ? (safeCount / total) * 100 : 0;
  const riskyPercentage = total > 0 ? (riskyCount / total) * 100 : 0;

  const timeRangeLabels = {
    today: "Today",
    week: "This Week",
    month: "This Month",
    overall: "Overall",
  };

  return (
    <div className="space-y-6">
      {/* This Week's Overview Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100"
      >
        {/* Header with Dropdown */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-mint-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-mint-600" />
            </div>
            <div>
              <h3 className="font-display font-bold text-gray-900">
                {timeRangeLabels[timeRange]}'s Overview
              </h3>
              <p className="text-xs text-gray-500">Safe vs Risky items</p>
            </div>
          </div>

          {/* Time Range Dropdown */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">
                {timeRangeLabels[timeRange]}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </motion.button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-10"
              >
                {(Object.keys(timeRangeLabels) as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setTimeRange(range);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                      range === timeRange
                        ? 'bg-mint-50 text-mint-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {timeRangeLabels[range]}
                  </button>
                ))}
              </motion.div>
            )}
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
    </div>
  );
}

