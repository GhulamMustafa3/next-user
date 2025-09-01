"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import UserDetail from "@/components/UserDetail";
import { fetchUser } from "@/lib/api/users";


export default function UserDetailPage() {
  const { id } = useParams(); 
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const allUsers = await fetchUser(); 
        const foundUser = allUsers.find((u: any) => u.id === id);
        setUser(foundUser || null);
      } finally {
        setLoading(false);
      }
    };
    if (id) loadUser();
  }, [id]);

  if (loading) {
    return (
      <main className="p-6">
        <p className="text-gray-500">Loading user details...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <UserDetail user={user} />
    </main>
  );
}
