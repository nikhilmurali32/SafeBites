"use client";

import { motion } from "framer-motion";

interface AllergyStepProps {
  selected: string[];
  onChange: (allergies: string[]) => void;
}

const allergies = [
  { id: "peanuts", label: "Peanuts", emoji: "🥜" },
  { id: "tree-nuts", label: "Tree Nuts", emoji: "🌰" },
  { id: "milk", label: "Milk", emoji: "🥛" },
  { id: "eggs", label: "Eggs", emoji: "🥚" },
  { id: "soy", label: "Soy", emoji: "🫘" },
  { id: "wheat", label: "Wheat/Gluten", emoji: "🌾" },
  { id: "fish", label: "Fish", emoji: "🐟" },
  { id: "shellfish", label: "Shellfish", emoji: "🦐" },
  { id: "sesame", label: "Sesame", emoji: "🍔" },
  { id: "mustard", label: "Mustard", emoji: "🌭" },
];

export default function AllergyStep({ selected, onChange }: AllergyStepProps) {
  const toggleAllergy = (allergyId: string) => {
    if (selected.includes(allergyId)) {
      onChange(selected.filter((id) => id !== allergyId));
    } else {
      onChange([...selected, allergyId]);
    }
  };

  return (
    <div className="space-y-6">
      <p className="text-gray-600 text-center">
        Select all that apply. We'll make sure to warn you about these
        ingredients.
      </p>

      <div className="grid grid-cols-2 gap-4">
        {allergies.map((allergy, index) => {
          const isSelected = selected.includes(allergy.id);
          return (
            <motion.button
              key={allergy.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleAllergy(allergy.id)}
              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                isSelected
                  ? "border-mint-500 bg-mint-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-mint-300"
              }`}
            >
              <div className="flex flex-col items-center gap-3">
                <span className="text-5xl">{allergy.emoji}</span>
                <span
                  className={`font-medium ${
                    isSelected ? "text-mint-700" : "text-gray-700"
                  }`}
                >
                  {allergy.label}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {selected.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-500 text-center mt-4"
        >
          No allergies? You can skip this step.
        </motion.p>
      )}
    </div>
  );
}

