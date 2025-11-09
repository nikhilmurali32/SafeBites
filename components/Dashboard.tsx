"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import DashboardHeader from "./dashboard/DashboardHeader";
import RecentScans from "./dashboard/RecentScans";
import ScanButton from "./dashboard/ScanButton";
import SafetyChart from "./dashboard/SafetyChart";
import CameraScanner from "./CameraScanner";
import ScanResult from "./ScanResult";
import IngredientExplorer from "./IngredientExplorer";

type DashboardView = "main" | "camera" | "result" | "explorer";

export default function Dashboard() {
  const { user } = useUser();
  const [currentView, setCurrentView] = useState<DashboardView>("main");
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);
  const [scans, setScans] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const userResponse = await fetch("/api/user");
      const userData = await userResponse.json();
      setUserData(userData.user);

      const scansResponse = await fetch("/api/user/scans?limit=10");
      const scansData = await scansResponse.json();
      setScans(scansData.scans || []);

      const statsResponse = await fetch("/api/user/stats");
      const statsData = await statsResponse.json();
      setStats(statsData.stats);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanNew = () => setCurrentView("camera");
  const handleCapture = (img: string) => {
    setCapturedImage(img);
    setCurrentView("result");
  };
  const handleExploreIngredients = () => setCurrentView("explorer");
  const handleBackToDashboard = async () => {
    setCurrentView("main");
    setCapturedImage(null);
    await fetchUserData();
  };

  if (currentView === "camera") {
    return <CameraScanner onClose={handleBackToDashboard} onCapture={handleCapture} />;
  }
  if (currentView === "result" && capturedImage) {
    return <ScanResult imageData={capturedImage} onBack={handleBackToDashboard} />;
  }
  if (currentView === "explorer") {
    return <IngredientExplorer onBack={handleBackToDashboard} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ✅ Background updated to match landing page */}
      {/* BACKGROUND — más oscuro, similar al landing */}
<div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_12%_12%,#22c55e_0%,#138a49_22%,#0b7a63_55%,#0a5e52_78%,#064b42_100%)]" />
<div className="pointer-events-none absolute inset-0 opacity-45
                [background:radial-gradient(70rem_40rem_at_50%_-12%,white,transparent)]" />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <DashboardHeader
            userName={userData?.name?.split(" ")[0] || user?.name?.split(" ")[0] || "User"}
            userEmail={userData?.email || user?.email || ""}
          />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[420px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full"
            />
          </div>
        ) : (
          <>
            {/* Main Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
  {/* Left: donut/stats */}
  <motion.div
    initial={{ opacity: 0, x: -16 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.15, duration: 0.45 }}
    className="lg:col-span-1 lg:mt-10"   // ⬅️ empuja hacia abajo en desktop
  >
    <div className="rounded-3xl bg-white/85 backdrop-blur shadow-xl ring-1 ring-white/40 p-6 h-[440px] flex flex-col justify-center">
      <SafetyChart stats={stats} />
    </div>
  </motion.div>

              {/* Right: scans + universe */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="lg:col-span-2 space-y-8"
              >
                <div className="rounded-3xl bg-white/85 backdrop-blur shadow-xl ring-1 ring-white/40 p-6 h-[440px]">
                  <RecentScans scans={scans} />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.28, duration: 0.45 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={handleExploreIngredients}
                  className="relative overflow-hidden cursor-pointer rounded-3xl p-8 text-white bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 shadow-xl"
                >
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="text-2xl font-display font-bold">Your Food Universe</h3>
                          <p className="text-emerald-50/80 text-sm mt-1">
                            Explore your ingredient journey
                          </p>
                        </div>
                      </div>
                      <div className="flex -space-x-3">
                        <div className="w-10 h-10 bg-emerald-300 rounded-full border-3 border-white/80 shadow-lg" />
                        <div className="w-10 h-10 bg-lime-300 rounded-full border-3 border-white/80 shadow-lg" />
                        <div className="w-10 h-10 bg-teal-300 rounded-full border-3 border-white/80 shadow-lg" />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-emerald-50/90 max-w-md">
                        Discover connections between ingredients through an interactive constellation
                        visualization
                      </p>
                      <motion.div className="font-semibold flex items-center gap-2" whileHover={{ x: 6 }}>
                        Enter Universe <span className="text-2xl">→</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </>
        )}
      </div>

      {/* Floating Scan Button */}
      <ScanButton onClick={handleScanNew} />
    </div>
  );
}
