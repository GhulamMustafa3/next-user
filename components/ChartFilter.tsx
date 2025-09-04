"use client";

import { motion, Variants } from "framer-motion";

type Props = {
  chartFilter: "7" | "30";
  setChartFilter: (val: "7" | "30") => void;
};

export default function ChartFilter({ chartFilter, setChartFilter }: Props) {
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const buttonVariants: Variants = {
    hidden: { opacity: 0, y: -5 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.3 },
    }),
  };

  const options = [
    { value: "7", label: "Last 7 Days" },
    { value: "30", label: "Last 30 Days" },
  ];

  return (
    <motion.div
      className="flex items-center justify-between mb-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      
      <h3 className="text-lg font-semibold text-gray-800">Sessions Overview</h3>

      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl p-1">
        {options.map((opt, i) => (
          <motion.button
            key={opt.value}
            custom={i}
            variants={buttonVariants}
            onClick={() => setChartFilter(opt.value as "7" | "30")}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all
              ${
                chartFilter === opt.value
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
          >
            {opt.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
