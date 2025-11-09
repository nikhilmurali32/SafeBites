"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import FoodUniverseGraph from "./food-universe/FoodUniverseGraph";
import IngredientBottomModal from "./food-universe/IngredientBottomModal";
import UserStatsModal from "./food-universe/UserStatsModal";

// Mock data for Jane's food universe
const mockUserData = {
  user: { 
    name: "Jane", 
    totalScans: 87,
    uniqueIngredients: 23,
    thisWeek: 12
  },
  ingredients: [
    { 
      id: "1", 
      name: "Palm Oil", 
      category: "Snacks", 
      safety: "moderate", 
      frequency: 7,
      scannedThisWeek: 3,
      summary: "A vegetable oil high in saturated fat. While not inherently dangerous, overconsumption may contribute to heart disease. Environmental concerns due to deforestation practices.",
      alternatives: ["Coconut oil", "Olive oil", "Avocado oil"]
    },
    { 
      id: "2", 
      name: "Oat Milk", 
      category: "Beverages", 
      safety: "safe", 
      frequency: 5,
      scannedThisWeek: 2,
      summary: "Plant-based milk alternative made from oats. Naturally dairy-free, often fortified with vitamins. Great for those with lactose intolerance or following vegan diets.",
      alternatives: []
    },
    { 
      id: "3", 
      name: "High Fructose Corn Syrup", 
      category: "Snacks", 
      safety: "avoid", 
      frequency: 6,
      scannedThisWeek: 4,
      summary: "Highly processed sweetener linked to obesity, diabetes, and metabolic syndrome. Best to avoid or minimize consumption significantly.",
      alternatives: ["Natural honey", "Maple syrup", "Organic cane sugar", "Stevia"]
    },
    { 
      id: "4", 
      name: "Soy Lecithin", 
      category: "Vegan", 
      safety: "safe", 
      frequency: 3,
      scannedThisWeek: 1,
      summary: "Natural emulsifier derived from soybeans. Generally safe for most people. Commonly used in chocolate and baked goods to improve texture.",
      alternatives: []
    },
    { 
      id: "5", 
      name: "Titanium Dioxide", 
      category: "Candy", 
      safety: "avoid", 
      frequency: 4,
      scannedThisWeek: 2,
      summary: "White pigment used for coloring. Banned in EU as of 2022 due to potential DNA damage concerns. Recommended to avoid when possible.",
      alternatives: ["Natural colorants", "Beet powder", "Turmeric"]
    },
    { 
      id: "6", 
      name: "Caffeine", 
      category: "Beverages", 
      safety: "moderate", 
      frequency: 9,
      scannedThisWeek: 5,
      summary: "Natural stimulant found in coffee, tea, and energy drinks. Safe in moderation (up to 400mg/day for adults). Can cause jitters and sleep issues in excess.",
      alternatives: ["Green tea", "Matcha", "Herbal tea"]
    },
    { 
      id: "7", 
      name: "Natural Flavors", 
      category: "Snacks", 
      safety: "safe", 
      frequency: 8,
      scannedThisWeek: 4,
      summary: "Derived from natural sources but can be vague. Generally safe, though the term can encompass hundreds of different compounds.",
      alternatives: []
    },
    { 
      id: "8", 
      name: "Vitamin C", 
      category: "Beverages", 
      safety: "safe", 
      frequency: 6,
      scannedThisWeek: 3,
      summary: "Essential nutrient and antioxidant. Supports immune system health and collagen production. Very safe even at high doses.",
      alternatives: []
    },
    { 
      id: "9", 
      name: "Carrageenan", 
      category: "Vegan", 
      safety: "moderate", 
      frequency: 2,
      scannedThisWeek: 1,
      summary: "Seaweed-derived thickener. Some studies suggest potential digestive issues, though evidence is mixed. Use in moderation.",
      alternatives: ["Agar agar", "Pectin", "Guar gum"]
    },
    { 
      id: "10", 
      name: "Artificial Sweeteners", 
      category: "Beverages", 
      safety: "moderate", 
      frequency: 5,
      scannedThisWeek: 2,
      summary: "Zero-calorie sugar substitutes like aspartame and sucralose. Generally safe but may affect gut bacteria. Some people report headaches.",
      alternatives: ["Stevia", "Monk fruit", "Erythritol"]
    },
  ]
};

interface IngredientExplorerProps {
  onBack: () => void;
}

export default function IngredientExplorer({ onBack }: IngredientExplorerProps) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showUserStats, setShowUserStats] = useState(false);

  const handleNodeClick = (node: any) => {
    if (node.id === "user") {
      setShowUserStats(true);
    } else {
      setSelectedNode(node);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-radial from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-indigo-300 hover:text-indigo-100 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-white mb-2">
                Your Food Universe
              </h1>
              <p className="text-indigo-300">
                Explore your ingredient journey through the cosmos
              </p>
            </div>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-6 mb-6 p-4 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10"
        >
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-green-400 shadow-lg shadow-green-500/50"></div>
            <span className="text-sm font-medium text-white">Safe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-500/50"></div>
            <span className="text-sm font-medium text-white">Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-red-400 shadow-lg shadow-red-500/50"></div>
            <span className="text-sm font-medium text-white">Avoid</span>
          </div>
          <div className="ml-auto text-sm text-indigo-300">
            Tap any node to explore
          </div>
        </motion.div>

        {/* Force-Directed Graph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FoodUniverseGraph
            userData={mockUserData}
            onNodeClick={handleNodeClick}
          />
        </motion.div>
      </div>

      {/* Bottom Modal for Ingredients */}
      <AnimatePresence>
        {selectedNode && (
          <IngredientBottomModal
            ingredient={selectedNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </AnimatePresence>

      {/* User Stats Modal */}
      <AnimatePresence>
        {showUserStats && (
          <UserStatsModal
            userData={mockUserData.user}
            onClose={() => setShowUserStats(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

