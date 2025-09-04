"use client";

import { User } from "@/types";
import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Props {
  users: User[];
  onSessionEnded?: () => void;
}

type ActiveRow = {
  userId: string;
  userName: string;
  role: string;
  sessionId: string;
  loginTime: string;
};

export default function UsersActivityChart({ users, onSessionEnded }: Props) {
  const [role, setRole] = useState<string | null>(null);
  const [localUsers, setLocalUsers] = useState<User[]>(users);

  useEffect(() => setLocalUsers(users), [users]);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await fetch("http://localhost:8008/api/me", {
          credentials: "include",
        });
        if (res.ok) {
          const me = await res.json();
          setRole(me.role ?? null);
        } else setRole(null);
      } catch {
        setRole(null);
      }
    };
    fetchRole();
  }, []);

  const roleData = useMemo(() => {
    const byRole: Record<string, { active: number; inactive: number }> = {};
    localUsers.forEach((u) => {
      const isActive = !!u.sessions?.some((s) => s.logoutTime == null);
      if (!byRole[u.role]) byRole[u.role] = { active: 0, inactive: 0 };
      if (isActive) byRole[u.role].active += 1;
      else byRole[u.role].inactive += 1;
    });
    return Object.entries(byRole).map(([r, { active, inactive }]) => ({
      role: r,
      active,
      inactive,
    }));
  }, [localUsers]);

  const activeRows = useMemo<ActiveRow[]>(() => {
    const rows: ActiveRow[] = [];
    localUsers.forEach((u) => {
      u.sessions?.forEach((s) => {
        if (!s.logoutTime) {
          rows.push({
            userId: u.id,
            userName: u.name,
            role: u.role,
            sessionId: s.id,
            loginTime: s.loginTime,
          });
        }
      });
    });
    return rows;
  }, [localUsers]);

  const showAdminTable = role === "admin" && activeRows.length > 0;

  const handleEndSession = async (userId: string, sessionId: string) => {
    try {
      const res = await fetch("http://localhost:8008/api/admin/end-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ userId, sessionId }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "Failed to end session");
        return;
      }

      setLocalUsers((prev) =>
        prev.map((u) =>
          u.id !== userId
            ? u
            : {
                ...u,
                sessions: (u.sessions || []).map((s) =>
                  s.id === sessionId ? { ...s, logoutTime: new Date().toISOString() } : s
                ),
              }
        )
      );
      onSessionEnded?.();
    } catch {
      alert("Network error while ending session");
    }
  };

  return (
    <div className="w-full bg-white rounded-2xl  p-6 space-y-8">
      {/* Graph */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Active vs Inactive Users by Role
      </h2>
      <div className="h-80 bg-gray-50 p-4 rounded-xl shadow-inner">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={roleData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
            <XAxis
              dataKey="role"
              tick={{ fill: "#374151", fontSize: 13, fontWeight: 500 }}
            />
            <YAxis allowDecimals={false} tick={{ fill: "#374151", fontSize: 13 }} />
            <Tooltip
              contentStyle={{ borderRadius: 8, borderColor: "#e5e7eb" }}
              itemStyle={{ color: "#1d4ed8", fontWeight: 500 }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="active" fill="#2563eb" radius={[10, 10, 0, 0]} />
            <Bar dataKey="inactive" fill="#94a3b8" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Admin-only table */}
      {showAdminTable && (
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Active User Sessions
          </h3>
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
            <table className="w-full text-sm border-collapse">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left">User</th>
                  <th className="px-4 py-2 text-left">Role</th>
                  <th className="px-4 py-2 text-left">Session Start</th>
                  <th className="px-4 py-2 text-center w-32">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeRows.map((row, i) => (
                  <tr
                    key={row.sessionId}
                    className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-2">{row.userName}</td>
                    <td className="px-4 py-2 capitalize">{row.role}</td>
                    <td className="px-4 py-2">
                      {new Date(row.loginTime).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <button
                        onClick={() => handleEndSession(row.userId, row.sessionId)}
                        className="px-3 py-1 bg-red-600 text-white rounded-md text-xs font-medium hover:bg-red-700 transition"
                      >
                        End Session
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
