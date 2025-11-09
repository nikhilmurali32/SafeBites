"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
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

  // Fetch user data and scans
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user?.sub) return;
    
    try {
      setIsLoading(true);
      
      // First ensure user exists in backend (via Next.js API which handles Auth0)
      const userResponse = await fetch('/api/user');
      const userData = await userResponse.json();
      setUserData(userData.user);
      
      // Import backend API functions
      const { getUserScans, getUserStats } = await import('@/lib/backendApi');
      
      // Fetch recent scans from backend
      try {
        const scansData = await getUserScans(user.sub, 10);
        setScans(scansData.scans || []);
      } catch (error) {
        console.error('Error fetching scans from backend:', error);
        setScans([]);
      }
      
      // Fetch stats from backend
      try {
        const statsData = await getUserStats(user.sub);
        setStats(statsData?.stats || null);
      } catch (error) {
        console.error('Error fetching stats from backend:', error);
        setStats(null);
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScanNew = () => {
    setCurrentView("camera");
  };

  const handleCapture = (imageData: string) => {
    setCapturedImage(imageData);
    setCurrentView("result");
  };

  const handleExploreIngredients = () => {
    setCurrentView("explorer");
  };

  const handleBackToDashboard = async () => {
    setCurrentView("main");
    setCapturedImage(null);
    // Refresh data after returning from scan
    await fetchUserData();
  };

  // Show Camera Scanner
  if (currentView === "camera") {
    return (
      <CameraScanner
        onClose={handleBackToDashboard}
        onCapture={handleCapture}
      />
    );
  }

  // Show Scan Result
  if (currentView === "result" && capturedImage) {
    return (
      <ScanResult
        imageData={capturedImage}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show Ingredient Explorer
  if (currentView === "explorer") {
    return (
      <IngredientExplorer
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-mint-50 via-white to-mint-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DashboardHeader 
            userName={userData?.name?.split(' ')[0] || user?.name?.split(' ')[0] || 'User'} 
            userEmail={userData?.email || user?.email || ''}
          />
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-mint-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <>
            {/* Main Grid Layout */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Stats Overview (takes 1 column on large screens) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="lg:col-span-1"
              >
                <SafetyChart stats={stats} />
              </motion.div>

              {/* Right Column - Recent Scans & Food Universe (takes 2 columns on large screens) */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="lg:col-span-2 space-y-6"
              >
                <RecentScans scans={scans} />
                
                {/* Food Universe Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  whileHover={{ scale: 1.01 }}
                  className="bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-700 rounded-3xl shadow-xl p-8 text-white cursor-pointer relative overflow-hidden"
                  onClick={handleExploreIngredients}
                >
                  {/* Starry background effect */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-12 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-16 right-8 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute bottom-12 left-10 w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-8 left-20 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute bottom-20 right-24 w-1 h-1 bg-white rounded-full"></div>
                    <div className="absolute top-1/2 left-1/3 w-0.5 h-0.5 bg-white rounded-full"></div>
                  </div>
                  
                  {/* Ambient glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/20 rounded-full blur-3xl"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-5xl">🌌</div>
                        <div>
                          <h3 className="text-2xl font-display font-bold">
                            Your Food Universe
                          </h3>
                          <p className="text-indigo-200 text-sm mt-1">
                            Explore your ingredient journey
                          </p>
                        </div>
                      </div>
                      <div className="flex -space-x-3">
                        <div className="w-10 h-10 bg-green-400 rounded-full border-3 border-white shadow-lg shadow-green-500/50"></div>
                        <div className="w-10 h-10 bg-yellow-400 rounded-full border-3 border-white shadow-lg shadow-yellow-500/50"></div>
                        <div className="w-10 h-10 bg-red-400 rounded-full border-3 border-white shadow-lg shadow-red-500/50"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-indigo-100 text-base max-w-md">
                        Discover connections between ingredients through an interactive constellation visualization
                      </p>
                      <motion.div 
                        className="text-white font-semibold flex items-center gap-2"
                        whileHover={{ x: 5 }}
                      >
                        Enter Universe 
                        <span className="text-2xl">→</span>
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

