"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

interface SideBarItemProps {
  icon: React.ComponentType<any>; 
  label: string;
  isOpen: boolean;
  onClick?: () => void; 
  custom?: number; 
}

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.05, duration: 0.25 },
  }),
};

export default function SideBarItem({ icon: Icon, label, isOpen, onClick, custom }: SideBarItemProps) {
  return (
    <motion.div
      className={`flex items-center gap-3 p-3 cursor-pointer rounded-md mt-2
        ${isOpen ? "justify-start" : "justify-center"}`}
      role="button"
      aria-label={label}
      onClick={onClick} 
      initial="hidden"
      animate="visible"
      variants={itemVariants}
      custom={custom}
    >
      <Icon className="w-6 h-6 text-blue-700 flex-shrink-0" />

      <span
        className={`text-gray-700 whitespace-nowrap transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100 max-w-[240px] ml-2" : "opacity-0 max-w-0 overflow-hidden"}`}
        style={{ willChange: "opacity, max-width" }}
      >
        {label}
      </span>
    </motion.div>
  );
}
