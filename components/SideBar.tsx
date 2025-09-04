"use client";

import { User } from "lucide-react";
import SideBarItem from "./SideBarItem";
import { motion, Variants } from "framer-motion";
import { useRouter } from "next/navigation";

interface SideBarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SideBar({ isOpen, setIsOpen }: SideBarProps) {
  const router = useRouter();

  // Only one menu item
  const menuItems = [
    { icon: User, label: "Users", route: "/dashboard/user" }, // route to user table
  ];

  const sidebarVariants: Variants = {
    closed: { width: 64, transition: { duration: 0.3, type: "spring", stiffness: 150 } },
    open: { width: 192, transition: { duration: 0.3, type: "spring", stiffness: 150 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.05, duration: 0.25 },
    }),
  };

  return (
    <motion.aside
      className="bg-white h-screen mt-16 flex flex-col overflow-hidden"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
    >
      <nav className="flex flex-col gap-2 mt-6 px-2">
        {menuItems.map((item, i) => (
          <motion.div key={item.label} custom={i} initial="hidden" animate="visible" variants={itemVariants}>
            <SideBarItem
              icon={item.icon}
              label={item.label}
              isOpen={isOpen}
              onClick={() => router.push(item.route)} // redirect to user table
            />
          </motion.div>
        ))}
      </nav>
    </motion.aside>
  );
}
