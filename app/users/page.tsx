"use client";

import Link from "next/link";
import UserTable from "@/components/UserTable";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function UsersPage() {
  const router = useRouter();
  const [role, setRole] = useState<string>("");
 const {isChecking}=useAuthRedirect();
 

  useEffect(() => {
  
    const storedRole = localStorage.getItem("role") || "";
    setRole(storedRole);
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("http://localhost:8008/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("role"); 
        router.push("/auth/login");
      }
    } catch (error) {
      console.error(error);
    }
  };
    if (isChecking) {
 
    return <p className="p-4">Checking authentication...</p>;
  }

  return (
    <main className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">All Users</h1>

        <div className="space-x-2">
         
          {role === "admin" && (
            <Link
              href="/users/new"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Create User
            </Link>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      <UserTable />
    </main>
  );
}
