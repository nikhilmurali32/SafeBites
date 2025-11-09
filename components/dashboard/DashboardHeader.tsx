"use client";

import { motion } from "framer-motion";
import { LogOut, Settings } from "lucide-react";
import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";

interface DashboardHeaderProps {
  userName: string;
  userEmail: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const { user } = useUser();

  const handleLogout = () => {
    window.location.href = "/api/auth/logout";
  };

  return (
    <div className="flex items-center justify-between text-white">
      {/* título a la izquierda */}
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
        >
          Welcome back, {userName}
        </motion.h1>
        <p className="text-emerald-50/90 text-lg mt-1">
          Take a picture and know what you eat instantly.
        </p>
      </div>

      {/* acciones a la derecha */}
      <div className="hidden sm:flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleLogout}
          className="p-3 rounded-xl bg-white/15 text-white backdrop-blur ring-1 ring-white/30 hover:bg-white/20 transition"
          title="Logout"
        >
          <LogOut className="w-5 h-5" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.07 }}
          whileTap={{ scale: 0.96 }}
          className="p-3 rounded-xl bg-white/15 text-white backdrop-blur ring-1 ring-white/30 hover:bg-white/20 transition"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </motion.button>

        {user?.picture && (
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="relative w-12 h-12 rounded-xl overflow-hidden ring-2 ring-white/60 shadow-lg shadow-black/20"
          >
            <Image
              src={user.picture}
              alt={userName}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
