"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import * as d3 from "d3-force";

interface Node {
  id: string;
  name: string;
  category?: string;
  safety?: string;
  frequency?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

interface Link {
  source: string | Node;
  target: string | Node;
}

interface FoodUniverseGraphProps {
  userData: {
    user: { name: string; totalScans: number };
    ingredients: any[];
  };
  onNodeClick: (node: any) => void;
}

export default function FoodUniverseGraph({ userData, onNodeClick }: FoodUniverseGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const [links, setLinks] = useState<Link[]>([]);
  const simulationRef = useRef<any>(null);

  useEffect(() => {
    // Set up nodes and links
    const centerNode: Node = {
      id: "user",
      name: userData.user.name,
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    };

    const ingredientNodes: Node[] = userData.ingredients.map((ing) => ({
      id: ing.id,
      name: ing.name,
      category: ing.category,
      safety: ing.safety,
      frequency: ing.frequency,
    }));

    const allNodes = [centerNode, ...ingredientNodes];
    
    const allLinks: Link[] = ingredientNodes.map((node) => ({
      source: "user",
      target: node.id,
    }));

    setNodes(allNodes);
    setLinks(allLinks);

    // D3 Force Simulation
    const simulation = d3
      .forceSimulation(allNodes as any)
      .force("link", d3.forceLink(allLinks).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(40));

    simulation.on("tick", () => {
      setNodes([...allNodes]);
    });

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [userData, dimensions]);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const getNodeColor = (node: Node) => {
    if (node.id === "user") return "rgb(99, 102, 241)"; // Indigo for user
    switch (node.safety) {
      case "safe":
        return "rgb(34, 197, 94)"; // Green
      case "moderate":
        return "rgb(234, 179, 8)"; // Yellow
      case "avoid":
        return "rgb(239, 68, 68)"; // Red
      default:
        return "rgb(148, 163, 184)"; // Gray
    }
  };

  const getNodeSize = (node: Node) => {
    if (node.id === "user") return 60;
    const baseSize = 25;
    const frequency = node.frequency || 1;
    return baseSize + Math.min(frequency * 3, 30);
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case "Snacks": return "🍿";
      case "Beverages": return "☕";
      case "Vegan": return "🌱";
      case "Candy": return "🍬";
      default: return "📦";
    }
  };

  return (
    <div className="w-full h-[700px] bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 relative overflow-hidden">
      <svg ref={svgRef} className="w-full h-full">
        {/* Links */}
        <g>
          {links.map((link, i) => {
            const source = typeof link.source === "string" 
              ? nodes.find(n => n.id === link.source)
              : link.source as Node;
            const target = typeof link.target === "string"
              ? nodes.find(n => n.id === link.target)
              : link.target as Node;
              
            if (!source || !target) return null;

            return (
              <line
                key={i}
                x1={source.x}
                y1={source.y}
                x2={target.x}
                y2={target.y}
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="1.5"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {nodes.map((node) => {
            const size = getNodeSize(node);
            const color = getNodeColor(node);

            return (
              <g
                key={node.id}
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: "pointer" }}
                onClick={() => onNodeClick(node)}
              >
                {/* Glow effect */}
                <circle
                  r={size + 10}
                  fill={color}
                  opacity="0.2"
                  filter="blur(8px)"
                />
                
                {/* Main node */}
                <motion.circle
                  r={size}
                  fill={color}
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth="2"
                  whileHover={{ scale: 1.2 }}
                  animate={{
                    opacity: [0.8, 1, 0.8],
                  }}
                  transition={{
                    opacity: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    },
                  }}
                />

                {/* Icon/Emoji */}
                <text
                  textAnchor="middle"
                  dy=".3em"
                  fontSize={node.id === "user" ? "30" : "20"}
                  fill="white"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.id === "user" ? "👋" : getCategoryEmoji(node.category || "")}
                </text>

                {/* Label */}
                <text
                  y={size + 20}
                  textAnchor="middle"
                  fontSize="12"
                  fill="white"
                  fontWeight="500"
                  style={{ pointerEvents: "none", userSelect: "none" }}
                >
                  {node.name}
                </text>

                {/* Frequency badge for ingredients */}
                {node.frequency && (
                  <text
                    y={size + 35}
                    textAnchor="middle"
                    fontSize="10"
                    fill="rgba(255, 255, 255, 0.6)"
                    style={{ pointerEvents: "none", userSelect: "none" }}
                  >
                    {node.frequency}x
                  </text>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Instructions */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-full pointer-events-none">
        Drag nodes to rearrange • Tap to explore
      </div>
    </div>
  );
}

