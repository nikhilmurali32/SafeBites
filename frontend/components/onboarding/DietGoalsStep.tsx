"use client";

import { motion } from "framer-motion";

interface DietGoalsStepProps {
  selected: string[];
  onChange: (goals: string[]) => void;
}

const dietGoals = [
  { id: "vegan", label: "Vegan", emoji: "🌱", description: "No animal products" },
  { id: "vegetarian", label: "Vegetarian", emoji: "🥗", description: "No meat or fish" },
  { id: "keto", label: "Keto", emoji: "🥑", description: "Low-carb, high-fat" },
  { id: "paleo", label: "Paleo", emoji: "🍖", description: "Whole foods focused" },
  { id: "low-carb", label: "Low Carb", emoji: "🥦", description: "Reduce carbohydrates" },
  { id: "high-protein", label: "High Protein", emoji: "💪", description: "Protein-rich diet" },
  { id: "gluten-free", label: "Gluten-Free", emoji: "🚫", description: "No gluten" },
  { id: "low-sodium", label: "Low Sodium", emoji: "🧂", description: "Reduce salt intake" },
  { id: "sugar-free", label: "Sugar-Free", emoji: "🍬", description: "No added sugars" },
  { id: "organic", label: "Organic", emoji: "🌿", description: "Organic products only" },
];

export default function DietGoalsStep({ selected, onChange }: DietGoalsStepProps) {
  const toggleGoal = (goalId: string) => {
    if (selected.includes(goalId)) {
      onChange(selected.filter((id) => id !== goalId));
    } else {
      onChange([...selected, goalId]);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">
        Choose your dietary preferences to get personalized recommendations.
      </p>

      <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {dietGoals.map((goal, index) => {
          const isSelected = selected.includes(goal.id);
          return (
            <motion.button
              key={goal.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleGoal(goal.id)}
              className={`p-5 rounded-2xl border-2 transition-all duration-300 text-left ${
                isSelected
                  ? "border-mint-500 bg-mint-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-mint-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-4xl">{goal.emoji}</span>
                <div className="flex-1">
                  <h3
                    className={`font-semibold mb-1 ${
                      isSelected ? "text-mint-700" : "text-gray-800"
                    }`}
                  >
                    {goal.label}
                  </h3>
                  <p className="text-xs text-gray-500">{goal.description}</p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-mint-50 border border-mint-200 rounded-xl p-4"
        >
          <p className="text-sm text-mint-800 text-center">
            ✨ {selected.length} goal{selected.length !== 1 ? "s" : ""} selected
          </p>
        </motion.div>
      )}
    </div>
  );
}

