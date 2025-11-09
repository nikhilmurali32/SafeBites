"use client";

import { useState, useEffect } from "react";
import { useUser } from '@auth0/nextjs-auth0/client';
import LoginScreen from "@/components/LoginScreen";
import OnboardingFlow from "@/components/OnboardingFlow";
import Dashboard from "@/components/Dashboard";
import { motion } from "framer-motion";
import { checkBackendConnection } from "@/lib/backendApi";

type AppState = "loading" | "login" | "onboarding" | "dashboard";

export default function Home() {
  const { user, isLoading } = useUser();
  const [appState, setAppState] = useState<AppState>("loading");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);

  // Check backend connection on app initialization
  useEffect(() => {
    const checkConnection = async () => {
      const isConnected = await checkBackendConnection();
      if (isConnected) {
        console.log('✅ Backend connection successful');
      } else {
        console.warn('⚠️ Backend connection failed - some features may not work');
      }
    };
    checkConnection();
  }, []);

  useEffect(() => {
    if (isLoading) {
      setAppState("loading");
      return;
    }

    if (!user) {
      setAppState("login");
      return;
    }

    // Check if user has completed onboarding
    // In a real app, this would be stored in the user database
    const onboardingComplete = localStorage.getItem(`onboarding_${user.sub}`);
    
    if (onboardingComplete || hasCompletedOnboarding) {
      setAppState("dashboard");
    } else {
      setAppState("onboarding");
    }
  }, [user, isLoading, hasCompletedOnboarding]);

  const handleOnboardingComplete = async (preferences: any) => {
    // Save preferences to database
    try {
      await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      
      // Mark onboarding as complete
      if (user?.sub) {
        localStorage.setItem(`onboarding_${user.sub}`, 'true');
      }
      setHasCompletedOnboarding(true);
      setAppState("dashboard");
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Still proceed to dashboard even if save fails
      setAppState("dashboard");
    }
  };

  if (appState === "loading") {
    return (
      <div className="min-h-screen bg-mint-gradient flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-mint-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      {appState === "login" && (
        <div className="bg-mint-gradient min-h-screen">
          <LoginScreen />
        </div>
      )}
      {appState === "onboarding" && (
        <div className="bg-mint-gradient min-h-screen">
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        </div>
      )}
      {appState === "dashboard" && <Dashboard />}
    </main>
  );
}

