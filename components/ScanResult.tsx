"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import SafetyScoreDial from "./scan-result/SafetyScoreDial";
import IngredientList from "./scan-result/IngredientList";
import BetterAlternatives from "./scan-result/BetterAlternatives";

interface ScanResultProps {
  imageData: string;
  onBack: () => void;
}

// Mock data - in production this would come from AI analysis
const mockResult = {
  productName: "Organic Almond Milk",
  brand: "Nature's Best",
  safetyScore: 85,
  ingredients: [
    { name: "Filtered Water", status: "safe", reason: "Pure and essential hydration base" },
    { name: "Organic Almonds", status: "safe", reason: "Healthy source of protein and good fats" },
    { name: "Sea Salt", status: "safe", reason: "Natural mineral, within healthy limits" },
    { name: "Gellan Gum", status: "moderate", reason: "Natural thickener, safe in small amounts" },
    { name: "Sunflower Lecithin", status: "safe", reason: "Natural emulsifier from sunflower seeds" },
    { name: "Vitamin D2", status: "safe", reason: "Essential nutrient for bone health" },
    { name: "Vitamin A", status: "safe", reason: "Important for vision and immune function" },
    { name: "Vitamin E", status: "safe", reason: "Antioxidant, supports cell health" },
  ],
};

const mockAlternatives = [
  { id: "1", name: "Silk Almond Milk", score: 92, image: "🥛", price: "$3.99" },
  { id: "2", name: "Califia Farms", score: 88, image: "🥛", price: "$4.49" },
  { id: "3", name: "Blue Diamond", score: 86, image: "🥛", price: "$3.79" },
  { id: "4", name: "Elmhurst 1925", score: 95, image: "🥛", price: "$5.99" },
  { id: "5", name: "Pacific Foods", score: 84, image: "🥛", price: "$3.49" },
];

export default function ScanResult({ imageData, onBack }: ScanResultProps) {
  const [isSaving, setIsSaving] = React.useState(false);
  const hasSavedRef = React.useRef(false); // Use ref to persist across re-renders
  const score = mockResult.safetyScore;

  // Save scan to database on mount (only once, even in Strict Mode)
  React.useEffect(() => {
    // Skip if already saved
    if (hasSavedRef.current) {
      console.log('Scan already saved, skipping...');
      return;
    }
    
    const saveScanOnce = async () => {
      // Double-check before saving
      if (hasSavedRef.current) return;
      
      hasSavedRef.current = true; // Mark as saved immediately
      setIsSaving(true);
      
      try {
        const scanData = {
          productName: mockResult.productName,
          brand: mockResult.brand,
          image: imageData,
          safetyScore: mockResult.safetyScore,
          isSafe: mockResult.safetyScore >= 70,
          ingredients: mockResult.ingredients,
        };

        const response = await fetch('/api/user/scans', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(scanData),
        });

        if (response.ok) {
          console.log('Scan saved successfully');
        } else {
          console.error('Failed to save scan');
          hasSavedRef.current = false; // Reset on failure
        }
      } catch (error) {
        console.error('Error saving scan:', error);
        hasSavedRef.current = false; // Reset on error
      } finally {
        setIsSaving(false);
      }
    };

    saveScanOnce();
  }, []); // Empty dependency array - only run once

  // Dynamic background based on score
  const getBackgroundGradient = (score: number) => {
    if (score >= 80) {
      return "from-green-50 via-white to-green-50/30";
    } else if (score >= 60) {
      return "from-yellow-50 via-white to-yellow-50/30";
    } else if (score >= 40) {
      return "from-orange-50 via-white to-orange-50/30";
    } else {
      return "from-red-50 via-white to-red-50/30";
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(score)} transition-all duration-1000`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-display font-bold text-gray-900">
            Scan Results
          </h1>
          <p className="text-gray-600 mt-2">
            AI-powered analysis complete
          </p>
        </motion.div>

        {/* Split Screen Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Side - Product Info & Score */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Product Image Card */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
              <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 mb-4">
                <img
                  src={imageData}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-1">
                  {mockResult.productName}
                </h2>
                <p className="text-gray-500">{mockResult.brand}</p>
              </div>
            </div>

            {/* Safety Score Dial */}
            <SafetyScoreDial score={score} />
          </motion.div>

          {/* Right Side - Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <IngredientList ingredients={mockResult.ingredients} />
          </motion.div>
        </div>

        {/* Better Alternatives Carousel */}
        <BetterAlternatives alternatives={mockAlternatives} currentScore={score} />
      </div>
    </div>
  );
}

