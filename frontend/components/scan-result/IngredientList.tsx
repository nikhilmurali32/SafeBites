"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { useState } from "react";

interface Ingredient {
  name: string;
  status: "safe" | "moderate" | "risky";
  reason: string;
}

interface IngredientListProps {
  ingredients: Ingredient[];
}

export default function IngredientList({ ingredients }: IngredientListProps) {
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);

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
          icon: AlertTriangle,
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

  const safeCount = ingredients.filter((i) => i.status === "safe").length;
  const moderateCount = ingredients.filter((i) => i.status === "moderate").length;
  const riskyCount = ingredients.filter((i) => i.status === "risky").length;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100 h-full">
      <div className="mb-6">
        <h3 className="text-xl font-display font-bold text-gray-900 mb-2">
          Ingredient Analysis
        </h3>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
            {safeCount} Safe
          </span>
          {moderateCount > 0 && (
            <span className="text-sm px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
              {moderateCount} Moderate
            </span>
          )}
          {riskyCount > 0 && (
            <span className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-full font-medium">
              {riskyCount} Risky
            </span>
          )}
        </div>
      </div>

      {/* Ingredients List */}
      <div className="space-y-3 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
        {ingredients.map((ingredient, index) => {
          const config = getStatusConfig(ingredient.status);
          const Icon = config.icon;
          const isSelected = selectedIngredient === ingredient.name;

          return (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() =>
                  setSelectedIngredient(isSelected ? null : ingredient.name)
                }
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  isSelected
                    ? `${config.bg} ${config.border} shadow-md`
                    : `bg-gray-50 border-gray-200 hover:${config.bg} hover:${config.border}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${config.badge} flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {ingredient.name}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${config.badge}`}
                      >
                        {ingredient.status.charAt(0).toUpperCase() +
                          ingredient.status.slice(1)}
                      </span>
                    </div>

                    {/* Expandable Reason */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className={`mt-2 pt-2 border-t ${config.border}`}>
                            <div className="flex items-start gap-2">
                              <Info className={`w-4 h-4 ${config.color} flex-shrink-0 mt-0.5`} />
                              <p className="text-sm text-gray-600">
                                {ingredient.reason}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {!isSelected && (
                      <p className="text-xs text-gray-500">
                        Click to see details
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

