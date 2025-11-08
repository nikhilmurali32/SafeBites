"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles } from "lucide-react";

interface ScanButtonProps {
  onClick: () => void;
}

export default function ScanButton({ onClick }: ScanButtonProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        delay: 0.5,
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-mint-500 to-mint-600 rounded-full shadow-2xl hover:shadow-mint-500/50 flex items-center justify-center group z-50"
    >
      {/* Pulsing ring effect */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 rounded-full bg-mint-400"
      />

      {/* Icon */}
      <div className="relative">
        <Camera className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute -top-2 -right-2"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
        </motion.div>
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 10 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-24 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap pointer-events-none"
      >
        Scan New Item
        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900"></div>
      </motion.div>
    </motion.button>
  );
}

