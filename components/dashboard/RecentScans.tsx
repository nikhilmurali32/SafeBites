"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, Clock, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface ScanItem {
  id: string;
  productName: string;
  image: string;
  isSafe: boolean;
  timestamp: string;
  safetyScore: number;
}

interface RecentScansProps {
  scans: ScanItem[];
}

// Helper function to format timestamp
function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const scanDate = new Date(timestamp);
  const diffMs = now.getTime() - scanDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  return scanDate.toLocaleDateString();
}

export default function RecentScans({ scans }: RecentScansProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!scans || scans.length === 0) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Recent Scans
        </h2>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No scans yet</p>
          <p className="text-sm text-gray-400">
            Click the scan button to analyze your first product!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-gray-900">
            Recent Scans
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Your latest food safety checks
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-mint-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all"
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Horizontal Scrollable Carousel */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
        style={{ scrollbarWidth: "thin" }}
      >
        {scans.map((item, index) => (
          <ScanCard key={item.id} item={item} index={index} />
        ))}
      </div>
    </div>
  );
}

interface ScanCardProps {
  item: ScanItem;
  index: number;
}

function ScanCard({ item, index }: ScanCardProps) {
  // Check if image is a data URL (base64) or emoji
  const isImageUrl = item.image.startsWith('data:') || item.image.startsWith('http');
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="min-w-[280px] bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200 hover:border-mint-300 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Image/Emoji */}
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-mint-100 to-mint-200 rounded-2xl flex items-center justify-center overflow-hidden group-hover:scale-110 transition-transform">
          {isImageUrl ? (
            <img 
              src={item.image} 
              alt={item.productName}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">{item.image}</span>
          )}
        </div>
        {/* Safety Badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 + 0.2, type: "spring" }}
        >
          {item.isSafe ? (
            <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full border border-green-200">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-semibold">Safe</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-200">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-semibold">Risky</span>
            </div>
          )}
        </motion.div>
      </div>

      {/* Product Name */}
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-mint-700 transition-colors">
        {item.productName}
      </h3>

      {/* Safety Score Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
          <span>Safety Score</span>
          <span className="font-semibold">{item.safetyScore}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${item.safetyScore}%` }}
            transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
            className={`h-full rounded-full ${
              item.safetyScore >= 70
                ? "bg-gradient-to-r from-green-400 to-green-500"
                : "bg-gradient-to-r from-amber-400 to-amber-500"
            }`}
          />
        </div>
      </div>

      {/* Timestamp */}
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        <span>{formatTimestamp(item.timestamp)}</span>
      </div>
    </motion.div>
  );
}

