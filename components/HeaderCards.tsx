"use client";

import { motion, Variants } from "framer-motion";

type Props = {
  totalUsers: number;
  myTeamSize: number;
  todayActiveUsers: number;
};

export default function HeaderCards({ totalUsers, myTeamSize, todayActiveUsers }: Props) {
  const cards = [
    { label: "Total Users", value: totalUsers },
    { label: "My Team Size", value: myTeamSize },
    { label: "Active Today", value: todayActiveUsers },
  ];

 
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.2, duration: 0.5, type: "spring", stiffness: 100 },
    }),
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-white p-4 rounded-2xl shadow"
        >
          <p className="text-xl font-bold text-blue-700">{c.label}</p>
          <p className="text-xl font-semibold mt-2">{c.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
