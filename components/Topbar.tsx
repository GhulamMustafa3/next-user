"use client";

import ProfileImage from "./ProfileImg";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

interface TopBarProps {
  profileUrl?: string;
  toggleSidebar?: () => void;
  userId: string;
}

export default function TopBar({ profileUrl, toggleSidebar, userId }: TopBarProps) {
  const router = useRouter();

  const handleProfileClick = () => {
    router.push(`/dashboard/user/${userId}`);
  };
  const handleDashboardClick = () => {
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8008/api/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/auth/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  
  const topBarVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: "spring", stiffness: 100 } },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between bg-white shadow px-4 z-50"
      initial="hidden"
      animate="visible"
      variants={topBarVariants}
    >
     
      <div className="flex items-center">
        {toggleSidebar && (
          <motion.button
            onClick={toggleSidebar}
            className="p-2 rounded-md mr-3 -ml-2"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Menu className="w-6 h-6 text-blue-700" />
          </motion.button>
        )}
        <h1 className="text-xl font-bold text-blue-700 cursor-pointer" onClick={handleDashboardClick}>Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <ProfileImage
            src={profileUrl}
            onProfileClick={handleProfileClick}
            onLogout={handleLogout}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
