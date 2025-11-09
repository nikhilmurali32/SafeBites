"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import AllergyStep from "./onboarding/AllergyStep";
import DietGoalsStep from "./onboarding/DietGoalsStep";
import IngredientsStep from "./onboarding/IngredientsStep";

interface OnboardingFlowProps {
  onComplete: (preferences: {
    allergies: string[];
    dietGoals: string[];
    avoidIngredients: string[];
  }) => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [dietGoals, setDietGoals] = useState<string[]>([]);
  const [avoidIngredients, setAvoidIngredients] = useState<string[]>([]);

  const steps = [
    {
      title: "Select your allergies",
      subtitle: "Help us keep you safe",
    },
    {
      title: "Choose your diet goals",
      subtitle: "Personalize your experience",
    },
    {
      title: "Ingredients to avoid",
      subtitle: "Customize your preferences",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      const preferences = {
        allergies,
        dietGoals,
        avoidIngredients,
      };
      console.log("Onboarding complete!", preferences);
      // Navigate to dashboard with preferences
      onComplete(preferences);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return allergies.length > 0 || true; // Allow skipping
      case 1:
        return dietGoals.length > 0 || true; // Allow skipping
      case 2:
        return avoidIngredients.length > 0 || true; // Allow skipping
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center flex-1">
                {/* Step Circle */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{
                    scale: index === currentStep ? 1.1 : 1,
                  }}
                  className="relative"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                      index < currentStep
                        ? "bg-mint-500 text-white"
                        : index === currentStep
                        ? "bg-mint-500 text-white ring-4 ring-mint-200"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                </motion.div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className="flex-1 h-1 mx-2 bg-gray-200 rounded overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{
                        width: index < currentStep ? "100%" : "0%",
                      }}
                      transition={{ duration: 0.4 }}
                      className="h-full bg-mint-500"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-center"
          >
            <h2 className="text-3xl font-display font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h2>
            <p className="text-lg text-gray-600">
              {steps[currentStep].subtitle}
            </p>
          </motion.div>
        </motion.div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 min-h-[400px]">
              {currentStep === 0 && (
                <AllergyStep
                  selected={allergies}
                  onChange={setAllergies}
                />
              )}
              {currentStep === 1 && (
                <DietGoalsStep
                  selected={dietGoals}
                  onChange={setDietGoals}
                />
              )}
              {currentStep === 2 && (
                <IngredientsStep
                  selected={avoidIngredients}
                  onChange={setAvoidIngredients}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4 mt-8"
        >
          {currentStep > 0 && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBack}
              className="flex-1 bg-white text-gray-700 font-semibold py-4 px-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              Back
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleNext}
            disabled={!canProceed()}
            className={`${
              currentStep === 0 ? "w-full" : "flex-1"
            } bg-gradient-to-r from-mint-500 to-mint-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {currentStep === steps.length - 1 ? "Complete" : "Continue"}
          </motion.button>
        </motion.div>

        {/* Skip Option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-6"
        >
          <button
            onClick={() => onComplete({ allergies: [], dietGoals: [], avoidIngredients: [] })}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Skip for now
          </button>
        </motion.div>
      </div>
    </div>
  );
}

