"use client";

import { motion } from "framer-motion";
import { Shield, Sparkles } from "lucide-react";

export default function LoginScreen() {
  const handleLogin = () => {
    // Redirect to Auth0 login
    window.location.href = '/api/auth/login';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full"
      >
        {/* Logo and Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-mint-400 to-mint-600 rounded-3xl shadow-lg mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-display font-bold text-gray-900 mb-3">
            SafeBite
          </h1>
          <p className="text-lg text-gray-600">
            Your intelligent food safety companion
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          <div className="space-y-6">
            {/* Feature Highlights */}
            <div className="space-y-3">
              <FeatureItem
                icon="🔍"
                text="Scan food labels instantly"
                delay={0.5}
              />
              <FeatureItem
                icon="🛡️"
                text="Detect unsafe ingredients"
                delay={0.6}
              />
              <FeatureItem
                icon="✨"
                text="Get AI-powered recommendations"
                delay={0.7}
              />
            </div>

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-mint-500 to-mint-600 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              Continue with Auth0
            </motion.button>

            {/* Privacy Note */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
              className="text-sm text-center text-gray-500"
            >
              By continuing, you agree to our{" "}
              <a href="#" className="text-mint-600 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="text-mint-600 hover:underline">
                Privacy Policy
              </a>
            </motion.p>
          </div>
        </motion.div>

        {/* Footer Message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="text-center mt-6 text-sm text-gray-600"
        >
          Join thousands making healthier food choices
        </motion.p>
      </motion.div>
    </div>
  );
}

interface FeatureItemProps {
  icon: string;
  text: string;
  delay: number;
}

function FeatureItem({ icon, text, delay }: FeatureItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="flex items-center gap-3 text-gray-700"
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-base">{text}</span>
    </motion.div>
  );
}

