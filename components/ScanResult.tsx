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
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResponse, setAnalysisResponse] = React.useState<any>(null);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);
  const hasSavedRef = React.useRef(false); // Use ref to persist across re-renders
  const hasAnalyzedRef = React.useRef(false); // Use ref to prevent duplicate API calls
  const score = mockResult.safetyScore;

  // Helper function to convert base64 data URL to Blob
  const dataURLtoBlob = (dataURL: string): Blob => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Call backend API to analyze the image
  React.useEffect(() => {
    // Skip if already analyzed
    if (hasAnalyzedRef.current) {
      console.log('Image already analyzed, skipping...');
      return;
    }

    const analyzeImage = async () => {
      // Double-check before analyzing
      if (hasAnalyzedRef.current) return;

      hasAnalyzedRef.current = true; // Mark as analyzed immediately
      setIsAnalyzing(true);
      setAnalysisError(null);

      try {
        // Convert base64 to Blob
        const blob = dataURLtoBlob(imageData);
        
        // Create FormData
        const formData = new FormData();
        formData.append('image', blob, 'scan.jpg');

        console.log('Sending image to backend API...');
        
        // Call backend API
        const response = await fetch('http://127.0.0.1:8000/api/analyze', {
          method: 'POST',
          body: formData,
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Backend API Response:', JSON.stringify(data, null, 2));
          setAnalysisResponse(data);
        } else {
          const errorText = await response.text();
          console.error('❌ Backend API Error:', response.status, errorText);
          setAnalysisError(`API Error: ${response.status} - ${errorText}`);
          hasAnalyzedRef.current = false; // Reset on failure
        }
      } catch (error) {
        console.error('❌ Error calling backend API:', error);
        setAnalysisError(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        hasAnalyzedRef.current = false; // Reset on error
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeImage();
  }, [imageData]); // Run when imageData changes

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
            {isAnalyzing ? 'AI-powered analysis in progress...' : 'AI-powered analysis complete'}
          </p>
          {/* Loading indicator */}
          {isAnalyzing && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                />
                <p className="text-sm font-semibold text-blue-800">Analyzing image with backend API...</p>
              </div>
            </div>
          )}
          {/* Debug: Show API response status */}
          {analysisResponse && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">✅ Backend API Response Received!</p>
              <p className="text-xs text-green-600 mt-1">Check browser console for full response details</p>
              <details className="mt-2">
                <summary className="text-xs text-green-700 cursor-pointer hover:text-green-900">View Response Preview</summary>
                <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto max-h-40">
                  {JSON.stringify(analysisResponse, null, 2)}
                </pre>
              </details>
            </div>
          )}
          {analysisError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800">❌ Backend API Error</p>
              <p className="text-xs text-red-600 mt-1">{analysisError}</p>
            </div>
          )}
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

