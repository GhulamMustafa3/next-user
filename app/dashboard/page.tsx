"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import HeaderCards from "@/components/HeaderCards";
import UserSelector from "@/components/UserSelector";
import ChartFilter from "@/components/ChartFilter";
import SessionsChart from "@/components/SessionsChart";
import ManageTeam from "@/components/ManageTeam";
import UserAgeChart from "@/components/UserAgeChart";
import ActiveUsersChart from "@/components/ActiveUserCharts";
import { User, Session, ChartSession } from "@/types";

export default function MyDashboard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chartFilter, setChartFilter] = useState<"7" | "30">("7");
  const [newTeamMemberId, setNewTeamMemberId] = useState<string>("");
  const [targetUserId, setTargetUserId] = useState<string>("");

 
  const fetchCurrentUserFromBackend = async () => {
    try {
      const res = await fetch("http://localhost:8008/api/me", {
        credentials: "include",
      });
      if (res.status === 401) {
        router.push("/auth/login");
        return null;
      }
      const data: User = await res.json();
      setCurrentUser(data);
      setSelectedUserId(data.id);
      if (data.role === "manager") setTargetUserId(data.id);
      return data;
    } catch (err) {
      console.error("Error fetching current user", err);
      return null;
    }
  };

  useEffect(() => {
    fetchCurrentUserFromBackend();
  }, [router]);


  const fetchUsersFromBackend = async () => {
    try {
      const res = await fetch("http://localhost:8008/api/users", {
        credentials: "include",
      });
      const data: User[] = await res.json();
      setUsers(data);

      if (currentUser?.role === "admin" && !targetUserId && data.length > 0) {
        setTargetUserId(data[0].id);
      }
    } catch (err) {
      console.error("Error fetching users", err);
    }
  };

  useEffect(() => {
    if (currentUser) fetchUsersFromBackend();
  }, [currentUser]);

  
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

  const filteredChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const now = new Date();
    const days = chartFilter === "7" ? 7 : 30;
    const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    return chartData.filter((d) => new Date(d.date) >= cutoff);
  }, [chartData, chartFilter]);

  if (!currentUser) return <p>Loading...</p>;
  if (!users.length) return <p>Loading users...</p>;

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

  
  const handleAddMember = async (userId: string) => {
    if (!newTeamMemberId) return;

    try {
      const user = users.find((u) => u.id === userId);
      if (!user || (user.team?.includes(newTeamMemberId) ?? false)) return;

      const updatedTeam = [...(user.team || []), newTeamMemberId];

      const res = await fetch(`http://localhost:8008/api/users/${userId}/team`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ team: updatedTeam }),
      });

      if (!res.ok) throw new Error("Failed to add member");

      setNewTeamMemberId("");

     
      await fetchUsersFromBackend();
      await fetchCurrentUserFromBackend();
    } catch (err) {
      console.error(err);
    }
  };


  const handleRemoveMember = async (userId: string, memberId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const updatedTeam = user.team?.filter((id) => id !== memberId) || [];

      const res = await fetch(`http://localhost:8008/api/users/${userId}/team`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ team: updatedTeam }),
      });

      if (!res.ok) throw new Error("Failed to remove member");

      await fetchUsersFromBackend();
      await fetchCurrentUserFromBackend();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">
        <div className="p-6 space-y-6 pt-20">
          <HeaderCards
            totalUsers={totalUsers}
            myTeamSize={myTeamSize}
            todayActiveUsers={todayActiveUsers}
          />

          <UserSelector
            currentUser={currentUser}
            users={users}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white p-4 rounded-2xl shadow min-h-[320px]">
              <ChartFilter chartFilter={chartFilter} setChartFilter={setChartFilter} />
              <SessionsChart filteredChartData={filteredChartData} />
            </div>

            <div className="flex-1 bg-white p-4 rounded-2xl shadow min-h-[320px]">
              <UserAgeChart users={users} />
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow min-h-[320px]">
            <ActiveUsersChart users={users} />
          </div>

          <ManageTeam
            currentUser={currentUser}
            users={users}
            targetUserId={targetUserId}
            setTargetUserId={setTargetUserId}
            newTeamMemberId={newTeamMemberId}
            setNewTeamMemberId={setNewTeamMemberId}
            handleAddMember={handleAddMember}
            handleRemoveMember={handleRemoveMember}
          />
        </div>
      </div>
    </div>
  );
}
