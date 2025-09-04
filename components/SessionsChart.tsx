"use client";

import { motion, Variants } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    CartesianGrid,
} from "recharts";
import { format, parseISO } from "date-fns";

 type Session = {
    id: string;
    userId: string;
    loginTime: string;
    logoutTime?: string;
};

 type ChartSession = {
    login: string;
    logout: string;
    duration: number; 
    ongoing: boolean;
};

type Props = {
    filteredChartData: {
        date: string; 
        totalMinutes: number;
        sessions: ChartSession[];
    }[];
};

export default function SessionsChart({ filteredChartData }: Props) {
    if (filteredChartData.length === 0) {
        return <p className="text-gray-500">No sessions found.</p>;
    }

    const chartDataWithHours = filteredChartData.map((d) => ({
        ...d,
        totalHours: d.totalMinutes / 60,
    }));

  
    const chartVariants: Variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, type: "spring", stiffness: 100 } },
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={chartVariants}
        >
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartDataWithHours} barSize={40} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />

                    <XAxis
                        dataKey="date"
                        tickFormatter={(str) => format(parseISO(str), "MMM d")}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                    />

                    <YAxis
                        domain={[1, 24]}
                        ticks={Array.from({ length: 24 }, (_, i) => i + 1)}
                        tickFormatter={(val) => `${val}h`}
                        tick={{ fontSize: 12, fill: "#6b7280" }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />

                    <Tooltip
                        cursor={{ fill: "rgba(59,130,246,0.1)" }}
                        content={({ payload, active }) => {
                            if (!active || !payload || payload.length === 0) return null;
                            const day = payload[0].payload;
                            return (
                                <div className="bg-white p-3 rounded-lg shadow text-sm border border-gray-200 max-w-xs">
                                    <p className="font-semibold text-gray-800">
                                        {format(parseISO(day.date), "EEEE, MMM d")}
                                    </p>
                                    <p className="text-gray-600">
                                        Total: {day.totalHours.toFixed(1)}h
                                    </p>
                                    <ul className="mt-2 space-y-1">
                                        {day.sessions.map((s: ChartSession, i: number) => (
                                            <li
                                                key={i}
                                                className={`${s.ongoing ? "text-blue-600 font-medium" : "text-gray-700"}`}
                                            >
                                                {s.login} → {s.logout} ({(s.duration / 60).toFixed(1)}h)
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        }}
                    />

                    <Bar dataKey="totalHours" radius={[6, 6, 0, 0]} fill="#3b82f6">
                        {chartDataWithHours.map((day, i) =>
                            day.sessions.some((s: ChartSession) => s.ongoing) ? (
                                <Cell
                                    key={i}
                                    fill="#3b82f6"
                                    stroke="#2563eb"
                                    strokeWidth={2}
                                    strokeDasharray="4 4"
                                />
                            ) : (
                                <Cell key={i} fill="#3b82f6" />
                            )
                        )}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </motion.div>
    );
}
