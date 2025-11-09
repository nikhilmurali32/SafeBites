"use client";

import { motion } from "framer-motion";
import { Shield, TrendingUp, AlertTriangle } from "lucide-react";

interface SafetyScoreDialProps {
  score: number;
}

export default function SafetyScoreDial({ score }: SafetyScoreDialProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { color: "#22c55e", label: "Excellent", icon: Shield };
    if (score >= 60) return { color: "#eab308", label: "Good", icon: TrendingUp };
    if (score >= 40) return { color: "#f97316", label: "Fair", icon: AlertTriangle };
    return { color: "#ef4444", label: "Poor", icon: AlertTriangle };
  };

  const { color, label, icon: Icon } = getScoreColor(score);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
    >
      <h3 className="text-xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Icon className="w-6 h-6 text-mint-600" />
        Safety Score
      </h3>

      {/* Circular Dial */}
      <div className="flex flex-col items-center">
        <div className="relative w-64 h-64">
          <svg className="transform -rotate-90 w-64 h-64">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#e5e7eb"
              strokeWidth="16"
              fill="none"
            />
            {/* Animated progress circle */}
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke={color}
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1, type: "spring", stiffness: 200 }}
              className="text-center"
            >
              <div className="text-6xl font-display font-bold" style={{ color }}>
                {score}
              </div>
              <div className="text-xl text-gray-500 font-medium">/ 100</div>
            </motion.div>
          </div>
        </div>

        {/* Score Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-6 text-center"
        >
          <div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-lg"
            style={{ backgroundColor: `${color}20`, color }}
          >
            <Icon className="w-5 h-5" />
            {label} Choice
          </div>
          <p className="text-sm text-gray-500 mt-3">
            {score >= 80 && "This product meets high safety standards"}
            {score >= 60 && score < 80 && "Generally safe with minor concerns"}
            {score >= 40 && score < 60 && "Some concerning ingredients found"}
            {score < 40 && "Multiple high-risk ingredients detected"}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

