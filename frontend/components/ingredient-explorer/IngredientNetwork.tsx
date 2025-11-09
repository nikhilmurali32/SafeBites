"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";

interface Ingredient {
  id: string;
  name: string;
  status: "safe" | "moderate" | "risky";
  category: string;
  x: number;
  y: number;
}

interface IngredientNetworkProps {
  ingredients: Ingredient[];
  onIngredientClick: (ingredient: Ingredient) => void;
  zoom: number;
}

export default function IngredientNetwork({
  ingredients,
  onIngredientClick,
  zoom,
}: IngredientNetworkProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const getColorByStatus = (status: string) => {
    switch (status) {
      case "safe":
        return "from-green-400 to-green-600";
      case "moderate":
        return "from-yellow-400 to-yellow-600";
      case "risky":
        return "from-red-400 to-red-600";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsPanning(true);
      setStartPan({
        x: e.clientX - pan.x,
        y: e.clientY - pan.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - startPan.x,
        y: e.clientY - startPan.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Draw connections between ingredients (simple lines for demo)
  const connections = [];
  for (let i = 0; i < ingredients.length - 1; i++) {
    const from = ingredients[i];
    const to = ingredients[i + 1];
    connections.push({ from, to });
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden cursor-move"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG for connections */}
      <svg
        className="absolute inset-0 pointer-events-none"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {connections.map((conn, idx) => {
          const x1 = (conn.from.x / 100) * (containerRef.current?.clientWidth || 1000);
          const y1 = (conn.from.y / 100) * (containerRef.current?.clientHeight || 600);
          const x2 = (conn.to.x / 100) * (containerRef.current?.clientWidth || 1000);
          const y2 = (conn.to.y / 100) * (containerRef.current?.clientHeight || 600);

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#e5e7eb"
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>

      {/* Ingredient Nodes */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: "0 0",
        }}
      >
        {ingredients.map((ingredient, index) => (
          <motion.div
            key={ingredient.id}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.05, type: "spring", stiffness: 200 }}
            whileHover={{ scale: 1.2, zIndex: 50 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              onIngredientClick(ingredient);
            }}
            className="absolute cursor-pointer"
            style={{
              left: `${ingredient.x}%`,
              top: `${ingredient.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            {/* Node */}
            <div className="relative group">
              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-br ${getColorByStatus(
                  ingredient.status
                )} shadow-lg flex items-center justify-center transition-all group-hover:shadow-2xl`}
              >
                <span className="text-2xl">
                  {ingredient.category === "Sweeteners"
                    ? "🍬"
                    : ingredient.category === "Preservatives"
                    ? "🧪"
                    : ingredient.category === "Additives"
                    ? "🎨"
                    : ingredient.category === "Nutrients"
                    ? "💊"
                    : ingredient.category === "Flavor Enhancers"
                    ? "✨"
                    : ingredient.category === "Minerals"
                    ? "⚗️"
                    : ingredient.category === "Flavoring"
                    ? "🌿"
                    : ingredient.category === "Oils & Fats"
                    ? "🫒"
                    : "📦"}
                </span>
              </div>

              {/* Pulse effect */}
              <motion.div
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className={`absolute inset-0 rounded-full bg-gradient-to-br ${getColorByStatus(
                  ingredient.status
                )} opacity-50`}
              />

              {/* Label */}
              <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-gray-900 text-white text-xs px-3 py-1 rounded-lg shadow-lg">
                  {ingredient.name}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pan Hint */}
      {!isPanning && ingredients.length > 0 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 text-white text-sm px-4 py-2 rounded-full pointer-events-none">
          Click and drag to pan • Click nodes to explore
        </div>
      )}
    </div>
  );
}

