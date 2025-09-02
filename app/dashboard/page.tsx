"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

type User = {
    id: string;
    name: string;
    role: string;
    email: string;
    age?: number;
    image_url?: string;
    team?: string[];
};

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

export default function MyDashboard() {
    const router = useRouter();

    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [chartFilter, setChartFilter] = useState<"7" | "30">("7");
    const [newTeamMemberId, setNewTeamMemberId] = useState<string>("");

    // 🔹 Fetch current user
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await fetch("http://localhost:8008/api/me", {
                    credentials: "include",
                });
                if (res.status === 401) {
                    router.push("auth/login");
                    return;
                }
                const data: User = await res.json();
                setCurrentUser(data);
                setSelectedUserId(data.id);
            } catch (err) {
                console.error("Error fetching current user", err);
            }
        };
        fetchCurrentUser();
    }, [router]);

    // 🔹 Fetch all users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("http://localhost:8008/api/users", {
                    credentials: "include",
                });
                const data: User[] = await res.json();
                setUsers(data);
            } catch (err) {
                console.error("Error fetching users", err);
            }
        };
        fetchUsers();
    }, []);

    // 🔹 Fetch all sessions
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch("http://localhost:8008/api/sessions", {
                    credentials: "include",
                });
                const data: Session[] = await res.json();
                setSessions(data);
            } catch (err) {
                console.error("Error fetching sessions", err);
            }
        };
        fetchSessions();
    }, []);

    // 🔹 Prepare chart data
    const chartData = useMemo(() => {
        if (!selectedUserId) return [];

        const userSessions = sessions.filter((s) => s.userId === selectedUserId);

        const grouped: Record<
            string,
            { date: string; totalMinutes: number; sessions: ChartSession[] }
        > = {};

        userSessions.forEach((session) => {
            const login = new Date(session.loginTime);
            const logout = session.logoutTime ? new Date(session.logoutTime) : new Date();
            const day = login.toISOString().slice(0, 10);
            const duration = Math.round((logout.getTime() - login.getTime()) / 60000);

            if (!grouped[day]) grouped[day] = { date: day, totalMinutes: 0, sessions: [] };

            grouped[day].totalMinutes += duration;
            grouped[day].sessions.push({
                login: login.toLocaleTimeString(),
                logout: session.logoutTime ? logout.toLocaleTimeString() : "Now (active)",
                duration,
                ongoing: !session.logoutTime,
            });
        });

        return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date));
    }, [sessions, selectedUserId]);

    // 🔹 Filter chart data by last 7 or 30 days
    const filteredChartData = useMemo(() => {
        if (!chartData || chartData.length === 0) return [];

        const now = new Date();
        const days = chartFilter === "7" ? 7 : 30;
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

        return chartData.filter((d) => new Date(d.date) >= cutoff);
    }, [chartData, chartFilter]);

    if (!currentUser) return <p>Loading...</p>;

    const totalUsers = users.length;
    const myTeamSize = currentUser.team?.length || 0;

    const today = new Date().toISOString().slice(0, 10);
    const teamIds = currentUser.team || [];
    const todayActiveUsers = Array.from(
        new Set(
            sessions
                .filter(
                    (s) =>
                        s.loginTime.slice(0, 10) === today &&
                        !s.logoutTime &&
                        (s.userId === currentUser.id || teamIds.includes(s.userId))
                )
                .map((s) => s.userId)
        )
    ).length;


    // 🔹 Add member to team
    const handleAddMember = () => {
        if (!newTeamMemberId || currentUser.team?.includes(newTeamMemberId)) return;

        const updatedTeam = [...(currentUser.team || []), newTeamMemberId];

        fetch(`http://localhost:8008/api/users/${currentUser.id}/team`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team: updatedTeam }),
        })
            .then(() => {
                setCurrentUser({ ...currentUser, team: updatedTeam });
                setNewTeamMemberId("");
            })
            .catch(console.error);
    };

    // 🔹 Remove member from team (cannot remove self)
    const handleRemoveMember = (memberId: string) => {
        if (memberId === currentUser.id) return; // prevent removing self
        const updatedTeam = currentUser.team?.filter((id) => id !== memberId) || [];

        fetch(`http://localhost:8008/api/users/${currentUser.id}/team`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ team: updatedTeam }),
        })
            .then(() => setCurrentUser({ ...currentUser, team: updatedTeam }))
            .catch(console.error);
    };
    // 🔹 Logout function
    const handleLogout = async () => {
        try {
            await fetch("http://localhost:8008/api/logout", {
                method: "POST",
                credentials: "include",
            });
            router.push("auth/login");
        } catch (err) {
            console.error("Logout failed", err);
        }
    };


    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">My Dashboard</h1>
                <button
                    onClick={handleLogout}
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                    Logout
                </button>
            </div>


            {/* Header Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl shadow">
                    <p className="text-gray-500">Total Users</p>
                    <p className="text-xl font-semibold">{totalUsers}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow">
                    <p className="text-gray-500">My Team Size</p>
                    <p className="text-xl font-semibold">{myTeamSize}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl shadow">
                    <p className="text-gray-500">Active Today</p>
                    <p className="text-xl font-semibold">{todayActiveUsers}</p>
                </div>
            </div>

            {/* User Selector */}
            <div>
                <label className="block text-gray-600 mb-2">Select User</label>
                <select
                    value={selectedUserId ?? ""}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="p-2 border rounded-md"
                >
                    <option value={currentUser.id}>{currentUser.name} (You)</option>
                    {currentUser.team?.map((uid) => {
                        const u = users.find((usr) => usr.id === uid);
                        return (
                            u && (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            )
                        );
                    })}
                </select>
            </div>

            {/* Chart Filter */}
            <div className="flex items-center mb-4 space-x-4">
                <label className="text-gray-600">Show:</label>
                <select
                    value={chartFilter}
                    onChange={(e) => setChartFilter(e.target.value as "7" | "30")}
                    className="p-2 border rounded-md"
                >
                    <option value="7">Last 7 Days</option>
                    <option value="30">Last 30 Days</option>
                </select>
            </div>

            {/* Sessions by Day Chart */}
            <div className="bg-white p-4 rounded-2xl shadow" style={{ minHeight: 320 }}>
                <h2 className="text-lg font-semibold mb-4">Sessions by Day</h2>
                {filteredChartData.length === 0 ? (
                    <p className="text-gray-500">No sessions found.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filteredChartData}>
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip
                                content={({ payload }) => {
                                    if (!payload || payload.length === 0) return null;
                                    const day = payload[0].payload;
                                    return (
                                        <div className="bg-white p-2 rounded shadow text-sm">
                                            <p className="font-semibold">{day.date}</p>
                                            <p>Total: {day.totalMinutes} min</p>
                                            <ul className="mt-2 space-y-1">
                                                {day.sessions.map((s: ChartSession, i: number) => (
                                                    <li key={i} className={s.ongoing ? "text-blue-600 italic" : ""}>
                                                        {s.login} → {s.logout} ({s.duration} min)
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    );
                                }}
                            />
                            <Bar dataKey="totalMinutes" fill="#3b82f6">
                                {filteredChartData.map((day, i) =>
                                    day.sessions.some((s: ChartSession) => s.ongoing) ? (
                                        <Cell key={i} fill="#3b82f6" stroke="#3b82f6" strokeDasharray="4 4" />
                                    ) : (
                                        <Cell key={i} fill="#3b82f6" />
                                    )
                                )}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {/* Manage Team (only for manager) */}
            {currentUser.role === "manager" && (
                <div className="bg-white p-4 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Manage Team</h2>

                    {/* Add member */}
                    <div className="flex space-x-2 mb-4">
                        <select
                            value={newTeamMemberId}
                            onChange={(e) => setNewTeamMemberId(e.target.value)}
                            className="p-2 border rounded-md flex-1"
                        >
                            <option value="">Select user to add</option>
                            {users
                                .filter((u) => u.id !== currentUser.id && !(currentUser.team?.includes(u.id)))
                                .map((u) => (
                                    <option key={u.id} value={u.id}>
                                        {u.name}
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={handleAddMember}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md"
                        >
                            Add
                        </button>
                    </div>

                    {/* Current team */}
                    <div>
                        <p className="font-semibold mb-2">Current Team Members:</p>
                        <ul className="space-y-1">
                            {currentUser.team?.map((uid) => {
                                const member = users.find((u) => u.id === uid);
                                if (!member) return null;
                                return (
                                    <li key={uid} className="flex justify-between items-center border p-2 rounded">
                                        <span>{member.name} </span>
                                        {member.id !== currentUser.id && (
                                            <button
                                                onClick={() => handleRemoveMember(uid)}
                                                className="bg-red-600 text-white px-2 py-1 rounded"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}
