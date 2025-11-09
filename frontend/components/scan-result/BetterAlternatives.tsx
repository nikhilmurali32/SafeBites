"use client";

import { motion } from "framer-motion";
import { TrendingUp, ExternalLink } from "lucide-react";

interface Alternative {
  id: string;
  name: string;
  score: number;
  image: string;
  price: string;
}

interface BetterAlternativesProps {
  alternatives: Alternative[];
  currentScore: number;
}

export default function BetterAlternatives({
  alternatives,
  currentScore,
}: BetterAlternativesProps) {
  console.log('BetterAlternatives received:', {
    alternatives,
    alternativesCount: alternatives.length,
    currentScore,
    firstAlt: alternatives[0]
  });

  // Filter to show only better alternatives (score >= currentScore)
  // But also show all if none are better, or show all recommendations
  const betterOptions = alternatives.filter((alt) => alt.score >= currentScore);
  
  // If no better options, show all recommendations anyway (they're still alternatives)
  const optionsToShow = betterOptions.length > 0 ? betterOptions : alternatives;

  console.log('BetterAlternatives filtering:', {
    betterOptionsCount: betterOptions.length,
    optionsToShowCount: optionsToShow.length,
    allScores: alternatives.map(a => a.score),
    currentScore
  });

  if (optionsToShow.length === 0) {
    console.warn('BetterAlternatives: No options to show');
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100"
    >
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-mint-100 rounded-lg">
            <TrendingUp className="w-6 h-6 text-mint-600" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold text-gray-900">
              Better Alternatives
            </h3>
            <p className="text-sm text-gray-600">
              {optionsToShow.length} alternative{optionsToShow.length !== 1 ? "s" : ""} found
              {betterOptions.length > 0 && ` (${betterOptions.length} better than current)`}
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Carousel */}
      <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
        {optionsToShow.map((alternative, index) => (
          <AlternativeCard
            key={alternative.id}
            alternative={alternative}
            index={index}
            currentScore={currentScore}
          />
        ))}
      </div>
    </motion.div>
  );
}

interface AlternativeCardProps {
  alternative: Alternative;
  index: number;
  currentScore: number;
}

function AlternativeCard({ alternative, index, currentScore }: AlternativeCardProps) {
  const scoreDiff = alternative.score - currentScore;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 + index * 0.1, duration: 0.4 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="min-w-[280px] bg-gradient-to-br from-mint-50 to-white rounded-2xl p-5 border-2 border-mint-200 hover:border-mint-400 hover:shadow-xl transition-all cursor-pointer group"
    >
      {/* Product Image */}
      <div className="w-full aspect-square bg-gradient-to-br from-mint-100 to-mint-200 rounded-xl flex items-center justify-center text-6xl mb-4 group-hover:scale-105 transition-transform">
        {alternative.image}
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-mint-700 transition-colors">
            {alternative.name}
          </h4>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-mint-600">
              {alternative.score}
            </span>
            <span className="text-sm text-gray-500">{alternative.price}</span>
          </div>
        </div>

        {/* Score Improvement Badge */}
        {scoreDiff > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + index * 0.1, type: "spring" }}
            className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-semibold"
          >
            <TrendingUp className="w-3 h-3" />
            +{scoreDiff} points better
          </motion.div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${alternative.score}%` }}
              transition={{ delay: 1 + index * 0.1, duration: 0.8 }}
              className="h-full bg-gradient-to-r from-mint-400 to-mint-600 rounded-full"
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-mint-500 hover:bg-mint-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 group/btn"
        >
          <span>View Details</span>
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </motion.button>
      </div>
    </motion.div>
  );
}

