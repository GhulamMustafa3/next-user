"use client";

import { useState, useEffect } from "react";
import { deleteUser, fetchUser, fetchSessions } from "@/lib/api/users";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  team?: number[];
  avatar?: string;
};

type Session = {
  userId: number;
  loginTime: string;
  logoutTime?: string;
};

interface UserTableProps {
  onSelectUser?: (userId: number) => void; // called for View Activity
  onManageTeam?: (userId: number) => void; // admin-only
}

export default function UserTable({ onSelectUser, onManageTeam }: UserTableProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentRole, setCurrentRole] = useState<string>("");

  useEffect(() => {
    const role = localStorage.getItem("role") || "";
    setCurrentRole(role);
  }, []);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUser();
      setUsers(data);
    };
    loadUsers();

    const loadSessions = async () => {
      const s = await fetchSessions();
      setSessions(s);
    };
    loadSessions();
  }, []);

  const handleDelete = async (id: number) => {
    if (currentRole !== "admin") return;
    await deleteUser(id.toString());
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Get last login for a user
  const getLastLogin = (userId: number) => {
    const userSessions = sessions
      .filter((s) => s.userId === userId)
      .sort((a, b) => new Date(b.loginTime).getTime() - new Date(a.loginTime).getTime());
    return userSessions[0]?.loginTime ? new Date(userSessions[0].loginTime).toLocaleString() : "-";
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Avatar</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Team Size</th>
            <th className="border p-2">Last Login</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50">
              <td className="border p-2">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    {u.name[0]}
                  </div>
                )}
              </td>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 capitalize">{u.role}</td>
              <td className="border p-2 text-center">{u.team?.length || 0}</td>
              <td className="border p-2">{getLastLogin(u.id)}</td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => onSelectUser && onSelectUser(u.id)}
                  className="text-blue-600 hover:underline"
                >
                  View Activity
                </button>
                {currentRole === "admin" && (
                  <>
                    <button
                      onClick={() => onManageTeam && onManageTeam(u.id)}
                      className="text-purple-600 hover:underline"
                    >
                      Manage Team
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan={7} className="border p-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
