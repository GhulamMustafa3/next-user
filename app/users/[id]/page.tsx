"use client";

import { useUsers } from "@/providers/UserProvider";
import UserDetail from "@/components/UserDetail";
import { useParams } from "next/navigation"; 

export default function UserDetailPage() {
  const { id } = useParams();       
  const { users } = useUsers();    
  const user = users.find((u) => u.id === id);

  return (
    <main className="p-6">
      <UserDetail user={user} />
    </main>
  );
}
