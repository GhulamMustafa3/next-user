"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserDetail from "@/components/UserDetail";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";


interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  age?: number;
  image_url?: string;
}

export default function UserDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isChecking } = useAuthRedirect();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch("http://localhost:8008/api/me", {
          credentials: "include",
        });

        if (res.status === 401) {
          router.push("/auth/login"); 
          return;
        }

        const data: User = await res.json();
        setCurrentUser(data);

        
        if (String(data.id) !== String(id)) {
          router.push(`/dashboard/user/${data.id}`);
          return;
        }
      } catch (err) {
        console.error("Error fetching current user", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCurrentUser();
  }, [id, router]);

  if (loading || isChecking) {
    return (
      <main className="p-6">
        <p className="text-gray-500">Loading user details...</p>
      </main>
    );
  }

  if (!currentUser) {
    return (
      <main className="p-6">
        <p className="text-red-500">User not found</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <UserDetail user={currentUser} />
    </main>
  );
}
