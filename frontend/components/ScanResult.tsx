"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import SafetyScoreDial from "./scan-result/SafetyScoreDial";
import IngredientList from "./scan-result/IngredientList";
import BetterAlternatives from "./scan-result/BetterAlternatives";
import { analyzeProduct, getRecommendations, addUserScan } from "@/lib/backendApi";
import { useUser } from '@auth0/nextjs-auth0/client';

interface ScanResultProps {
  imageData: string;
  onBack: () => void;
}

// Mock data removed - all data now comes from backend APIs

export default function ScanResult({ imageData, onBack }: ScanResultProps) {
  const { user } = useUser();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = React.useState(false);
  const [analysisResponse, setAnalysisResponse] = React.useState<any>(null);
  const [analysisError, setAnalysisError] = React.useState<string | null>(null);
  const [recommendations, setRecommendations] = React.useState<any>(null);
  const [recommendationsError, setRecommendationsError] = React.useState<string | null>(null);
  const hasSavedRef = React.useRef(false);
  const hasAnalyzedRef = React.useRef(false);

  // Parse analysis response to extract product data
  const productData = React.useMemo(() => {
    if (!analysisResponse) return null;

    try {
      const scoringData = JSON.parse(analysisResponse.scoring_data);
      console.log('Parsed scoring data:', scoringData);
      
      const overallScore = Math.round(scoringData.overall_score * 10); // Convert 0-10 to 0-100
      
      // Validate ingredient_scores exists and is an array
      if (!scoringData.ingredient_scores || !Array.isArray(scoringData.ingredient_scores)) {
        console.error('ingredient_scores is missing or not an array:', scoringData);
        return null;
      }
      
      // Map ingredient scores to UI format
      const ingredients = scoringData.ingredient_scores.map((item: any) => {
        // Normalize safety_score to lowercase for comparison
        const safetyScore = String(item.safety_score || '').toLowerCase().trim();
        let status: "safe" | "moderate" | "risky" = "safe";
        
        if (safetyScore === "low") {
          status = "risky";
        } else if (safetyScore === "medium") {
          status = "moderate";
        } else if (safetyScore === "high") {
          status = "safe";
        } else {
          // Log unexpected values for debugging
          console.warn(`Unexpected safety_score value: "${item.safety_score}" for ingredient: ${item.ingredient_name}`);
          // Default to moderate if we can't determine
          status = "moderate";
        }

        return {
          name: item.ingredient_name || "Unknown Ingredient",
          status: status,
          reason: item.reasoning || "No reasoning provided",
        };
      });

      console.log('Parsed ingredients:', ingredients);

      return {
        productName: analysisResponse.product_name || "Unknown Product",
        brand: "", // Backend doesn't provide brand currently
        safetyScore: overallScore,
        ingredients: ingredients,
      };
    } catch (error) {
      console.error('Error parsing analysis response:', error);
      console.error('Raw analysisResponse:', analysisResponse);
      return null;
    }
  }, [analysisResponse]);

  // Parse recommendations response
  const parsedRecommendations = React.useMemo(() => {
    if (!recommendations) return [];
    
    // Handle case where recommendations is a string (JSON)
    if (typeof recommendations === 'string') {
      if (recommendations.length === 0) return [];
      try {
        const parsed = JSON.parse(recommendations);
        // If parsed result has recommendations array, use it
        if (parsed && parsed.recommendations && Array.isArray(parsed.recommendations)) {
          const recs = parsed.recommendations;
          console.log('Parsed recommendations from string:', recs);
          return recs.map((r: any, index: number) => {
            // Parse health_score to number (try to extract number from string)
            // health_score is likely on 0-10 scale, convert to 0-100
            const healthScoreStr = String(r.health_score || "7");
            const match = healthScoreStr.match(/\d+(\.\d+)?/);
            let score = match ? parseFloat(match[0]) : 7;
            
            // If score is <= 10, assume it's on 0-10 scale and convert to 0-100
            // Otherwise, assume it's already on 0-100 scale
            if (score <= 10) {
              score = Math.round(score * 10);
            } else {
              score = Math.round(score);
            }

            return {
              id: `rec-${index}-${r.product_name || `rec-${index}`}`,
              name: r.product_name || "Unknown Product",
              score: score,
              image: "🥛", // Default emoji, backend doesn't provide images
              price: "", // Backend doesn't provide price
            };
          });
        }
        // If parsed result is directly an array
        if (Array.isArray(parsed)) {
          console.log('Parsed recommendations is array:', parsed);
          return parsed.map((r: any, index: number) => {
            // Parse health_score to number (try to extract number from string)
            // health_score is likely on 0-10 scale, convert to 0-100
            const healthScoreStr = String(r.health_score || "7");
            const match = healthScoreStr.match(/\d+(\.\d+)?/);
            let score = match ? parseFloat(match[0]) : 7;
            
            // If score is <= 10, assume it's on 0-10 scale and convert to 0-100
            // Otherwise, assume it's already on 0-100 scale
            if (score <= 10) {
              score = Math.round(score * 10);
            } else {
              score = Math.round(score);
            }

            return {
              id: `rec-${index}-${r.product_name || `rec-${index}`}`,
              name: r.product_name || "Unknown Product",
              score: score,
              image: "🥛",
              price: "",
            };
          });
        }
      } catch (error) {
        console.error('Error parsing recommendations string:', error);
        return [];
      }
    }
    
    // Handle case where recommendations is already an object
    if (typeof recommendations === 'object') {
      // If it has a recommendations array
      if (recommendations.recommendations && Array.isArray(recommendations.recommendations)) {
        const recs = recommendations.recommendations;
        console.log('Recommendations from object.recommendations:', recs);
        return recs.map((r: any, index: number) => {
          const healthScoreStr = String(r.health_score || "70");
          const match = healthScoreStr.match(/\d+/);
          const score = match ? parseInt(match[0], 10) : 70;

          return {
            id: `rec-${index}-${r.product_name || `rec-${index}`}`,
            name: r.product_name || "Unknown Product",
            score: score,
            image: "🥛",
            price: "",
          };
        });
      }
      // If it's directly an array
      if (Array.isArray(recommendations)) {
        console.log('Recommendations is array:', recommendations);
        return recommendations.map((r: any, index: number) => {
          // Parse health_score to number (try to extract number from string)
          // health_score is likely on 0-10 scale, convert to 0-100
          const healthScoreStr = String(r.health_score || "7");
          const match = healthScoreStr.match(/\d+(\.\d+)?/);
          let score = match ? parseFloat(match[0]) : 7;
          
          // If score is <= 10, assume it's on 0-10 scale and convert to 0-100
          // Otherwise, assume it's already on 0-100 scale
          if (score <= 10) {
            score = Math.round(score * 10);
          } else {
            score = Math.round(score);
          }

          return {
            id: `rec-${index}-${r.product_name || `rec-${index}`}`,
            name: r.product_name || "Unknown Product",
            score: score,
            image: "🥛",
            price: "",
          };
        });
      }
    }

    console.warn('Unexpected recommendations format:', recommendations);
    return [];
  }, [recommendations]);

  // Use productData if available, otherwise show loading state
  const displayData = productData || {
    productName: isAnalyzing ? "Analyzing..." : "Loading...",
    brand: "",
    safetyScore: 0,
    ingredients: [],
  };

  const score = displayData.safetyScore;

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
        const blob = dataURLtoBlob(imageData);
        // Pass user ID to include preferences in analysis
        const data = await analyzeProduct(blob, user?.sub || undefined);
        console.log('✅ Backend API Response:', JSON.stringify(data, null, 2));
        setAnalysisResponse(data);

        // After successful analysis, fetch recommendations
        if (data.product_name && data.scoring_data) {
          try {
            const scoringData = JSON.parse(data.scoring_data);
            const overallScore = scoringData.overall_score;
            
            setIsLoadingRecommendations(true);
            setRecommendationsError(null);
            
            const recData = await getRecommendations(data.product_name, overallScore);
            console.log('✅ Recommendations Response:', JSON.stringify(recData, null, 2));
            
            // Handle the response structure - reccomender_data is a JSON string
            if (recData.reccomender_data) {
              // reccomender_data is a JSON string that needs to be parsed
              console.log('Setting recommendations from reccomender_data:', recData.reccomender_data);
              setRecommendations(recData.reccomender_data);
            } else if (recData.recommendations) {
              // If recommendations is already parsed
              console.log('Setting recommendations from recommendations field:', recData.recommendations);
              setRecommendations(recData.recommendations);
            } else {
              // Fallback to entire response
              console.log('Setting recommendations from entire response:', recData);
              setRecommendations(recData);
            }
          } catch (recError) {
            console.error('❌ Error fetching recommendations:', recError);
            setRecommendationsError(`Failed to load recommendations: ${recError instanceof Error ? recError.message : 'Unknown error'}`);
          } finally {
            setIsLoadingRecommendations(false);
          }
        }
      } catch (error) {
        console.error('❌ Error calling backend API:', error);
        setAnalysisError(`Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        hasAnalyzedRef.current = false;
      } finally {
        setIsAnalyzing(false);
      }
    };

    analyzeImage();
  }, [imageData]); // Run when imageData changes

  // Save scan to backend database only when real product data is available
  React.useEffect(() => {
    // Only save if we have real product data and user is logged in
    if (!productData || !user?.sub) {
      return;
    }

    // Skip if already saved
    if (hasSavedRef.current) {
      console.log('Scan already saved, skipping...');
      return;
    }
    
    const saveScanOnce = async () => {
      // Double-check before saving
      if (hasSavedRef.current || !productData || !user?.sub) return;
      
      hasSavedRef.current = true; // Mark as saved immediately
      setIsSaving(true);
      
      try {
        // Use productData directly - save to backend
        const scanData = {
          productName: productData.productName,
          brand: productData.brand,
          image: imageData,
          safetyScore: productData.safetyScore,
          isSafe: productData.safetyScore >= 70,
          ingredients: productData.ingredients,
        };

        await addUserScan(user.sub, scanData);
        console.log('Scan saved successfully to backend with real data:', productData.productName);
      } catch (error) {
        console.error('Error saving scan to backend:', error);
        hasSavedRef.current = false; // Reset on error
      } finally {
        setIsSaving(false);
      }
    };

    saveScanOnce();
  }, [productData, imageData, user?.sub]); // Run when productData is available

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
          {/* Recommendations loading */}
          {isLoadingRecommendations && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                />
                <p className="text-sm font-semibold text-blue-800">Loading recommendations...</p>
              </div>
            </div>
          )}
          {/* Debug: Show API response status */}
          {analysisResponse && !isAnalyzing && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">✅ Backend API Response Received!</p>
              <p className="text-xs text-green-600 mt-1">Check browser console for full response details</p>
            </div>
          )}
          {analysisError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm font-semibold text-red-800">❌ Backend API Error</p>
              <p className="text-xs text-red-600 mt-1">{analysisError}</p>
            </div>
          )}
          {recommendationsError && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">⚠️ Recommendations Error</p>
              <p className="text-xs text-yellow-600 mt-1">{recommendationsError}</p>
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
                  {displayData.productName}
                </h2>
                {displayData.brand && (
                  <p className="text-gray-500">{displayData.brand}</p>
                )}
              </div>
            </div>

            {/* Safety Score Dial */}
            {score > 0 && <SafetyScoreDial score={score} />}
          </motion.div>

          {/* Right Side - Ingredients */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {displayData.ingredients.length > 0 ? (
              <IngredientList ingredients={displayData.ingredients} />
            ) : (
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
                <p className="text-gray-500 text-center">
                  {isAnalyzing ? 'Loading ingredients...' : 'No ingredients data available'}
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Better Alternatives Carousel */}
        {parsedRecommendations.length > 0 && score > 0 && (() => {
          console.log('Rendering BetterAlternatives with:', {
            parsedRecommendations,
            parsedCount: parsedRecommendations.length,
            currentScore: score,
            firstRec: parsedRecommendations[0]
          });
          return <BetterAlternatives alternatives={parsedRecommendations} currentScore={score} />;
        })()}
      </div>
    </div>
  );
}

