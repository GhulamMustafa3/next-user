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
       

        
      </div>

      <UserTable />
    </main>
  );
}
