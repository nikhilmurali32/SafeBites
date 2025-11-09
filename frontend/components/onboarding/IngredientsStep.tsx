"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { X, Plus } from "lucide-react";

interface IngredientsStepProps {
  selected: string[];
  onChange: (ingredients: string[]) => void;
}

const commonIngredients = [
  { id: "hfcs", label: "High Fructose Corn Syrup", emoji: "🌽" },
  { id: "msg", label: "MSG", emoji: "⚗️" },
  { id: "artificial-colors", label: "Artificial Colors", emoji: "🎨" },
  { id: "artificial-sweeteners", label: "Artificial Sweeteners", emoji: "🍬" },
  { id: "preservatives", label: "Preservatives", emoji: "🧪" },
  { id: "palm-oil", label: "Palm Oil", emoji: "🌴" },
  { id: "trans-fats", label: "Trans Fats", emoji: "🚫" },
  { id: "sodium-nitrite", label: "Sodium Nitrite", emoji: "🥓" },
  { id: "carrageenan", label: "Carrageenan", emoji: "🌊" },
  { id: "bha-bht", label: "BHA/BHT", emoji: "💊" },
];

export default function IngredientsStep({
  selected,
  onChange,
}: IngredientsStepProps) {
  const [customInput, setCustomInput] = useState("");

  const toggleIngredient = (ingredientId: string) => {
    if (selected.includes(ingredientId)) {
      onChange(selected.filter((id) => id !== ingredientId));
    } else {
      onChange([...selected, ingredientId]);
    }
  };

  const addCustomIngredient = () => {
    if (customInput.trim() && !selected.includes(customInput.trim())) {
      onChange([...selected, customInput.trim()]);
      setCustomInput("");
    }
  };

  const removeIngredient = (ingredient: string) => {
    onChange(selected.filter((id) => id !== ingredient));
  };

  const customIngredients = selected.filter(
    (item) => !commonIngredients.find((ing) => ing.id === item)
  );

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">
        Tell us which ingredients you'd like to avoid in your food.
      </p>

      {/* Common Ingredients */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Common Ingredients
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {commonIngredients.map((ingredient, index) => {
            const isSelected = selected.includes(ingredient.id);
            return (
              <motion.button
                key={ingredient.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.04, duration: 0.3 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => toggleIngredient(ingredient.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  isSelected
                    ? "border-mint-500 bg-mint-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-mint-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{ingredient.emoji}</span>
                  <span
                    className={`text-sm font-medium ${
                      isSelected ? "text-mint-700" : "text-gray-700"
                    }`}
                  >
                    {ingredient.label}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Custom Ingredient Input */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Add Custom Ingredient
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addCustomIngredient()}
            placeholder="e.g., Red Dye #40"
            className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-mint-500 focus:outline-none transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={addCustomIngredient}
            disabled={!customInput.trim()}
            className="px-6 py-3 bg-mint-500 text-white rounded-xl hover:bg-mint-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add
          </motion.button>
        </div>
      </div>

      {/* Custom Ingredients List */}
      {customIngredients.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
            Your Custom Ingredients
          </h3>
          <div className="flex flex-wrap gap-2">
            {customIngredients.map((ingredient) => (
              <motion.div
                key={ingredient}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex items-center gap-2 px-4 py-2 bg-mint-100 text-mint-700 rounded-full border border-mint-300"
              >
                <span className="text-sm font-medium">{ingredient}</span>
                <button
                  onClick={() => removeIngredient(ingredient)}
                  className="hover:bg-mint-200 rounded-full p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Summary */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-mint-50 border border-mint-200 rounded-xl p-4"
        >
          <p className="text-sm text-mint-800 text-center">
            🛡️ Avoiding {selected.length} ingredient{selected.length !== 1 ? "s" : ""}
          </p>
        </motion.div>
      )}
    </div>
  );
}

