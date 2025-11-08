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

type DashboardView = "main" | "camera" | "result";

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
    try {
      setIsLoading(true);
      
      // Fetch user info
      const userResponse = await fetch('/api/user');
      const userData = await userResponse.json();
      setUserData(userData.user);
      
      // Fetch recent scans
      const scansResponse = await fetch('/api/user/scans?limit=10');
      const scansData = await scansResponse.json();
      setScans(scansData.scans || []);
      
      // Fetch stats
      const statsResponse = await fetch('/api/user/stats');
      const statsData = await statsResponse.json();
      setStats(statsData.stats);
      
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
              {/* Left Column - Recent Scans (takes 2 columns on large screens) */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="lg:col-span-2 space-y-6"
              >
                <RecentScans scans={scans} />
              </motion.div>

              {/* Right Column - Stats & Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="space-y-6"
              >
                <SafetyChart stats={stats} />
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

