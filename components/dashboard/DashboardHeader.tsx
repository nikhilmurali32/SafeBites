"use client";

import { motion } from "framer-motion";
import { Bell, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import { useUser } from '@auth0/nextjs-auth0/client';

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
}

export default function DashboardHeader({ userName, userEmail }: DashboardHeaderProps) {
  const { user } = useUser();

  const handleLogout = () => {
    window.location.href = '/api/auth/logout';
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl font-display font-bold text-gray-900"
        >
          Welcome back, {userName} 👋
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-2 text-lg text-gray-600"
        >
          Let's make healthy choices today
        </motion.p>
      </div>

      {/* Action Buttons */}
      <div className="hidden sm:flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 relative"
        >
          <Bell className="w-5 h-5 text-gray-600" />
          {/* Notification badge */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
        >
          <Settings className="w-5 h-5 text-gray-600" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100"
          title="Logout"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </motion.button>
        {user?.picture && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative w-12 h-12 bg-gradient-to-br from-mint-400 to-mint-600 rounded-xl shadow-sm overflow-hidden"
          >
            <Image
              src={user.picture}
              alt={userName}
              fill
              className="object-cover"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}

