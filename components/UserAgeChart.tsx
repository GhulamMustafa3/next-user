"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMemo } from "react";
import { User } from "@/types";

type Props = {
  users: User[];
};

export default function UserAgeChart({ users }: Props) {
  const ageData = useMemo(() => {
    
    const counts: Record<number, number> = {};
    for (let age = 20; age <= 65; age++) {
      counts[age] = 0;
    }

   
    users.forEach((u) => {
      if (u.age !== undefined && u.age >= 20 && u.age <= 65) {
        counts[u.age] = (counts[u.age] || 0) + 1;
      }
    });

    return Object.entries(counts).map(([age, count]) => ({
      age: Number(age),
      count,
    }));
  }, [users]);

  
  const xTicks = Array.from({ length: 10 }, (_, i) => 20 + i * 5); 

  return (
    <div className="mt-6 p-4 bg-white rounded-xl ">
      <h2 className="text-xl font-semibold mb-4">User Age Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={ageData}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="age"
            type="number"
            domain={[20, 65]}
            ticks={xTicks} 
            label={{
              value: "Age",
              position: "insideBottom",
              offset: -5,
            }}
          />
          <YAxis
            type="number"
            allowDecimals={false} 
            tickFormatter={(val) => val.toString()}
            label={{ value: "Count", angle: -90, position: "Left" }}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
