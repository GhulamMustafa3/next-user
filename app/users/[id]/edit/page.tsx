"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUsers } from "@/providers/UserProvider";
import UserForm from "@/components/UserForm"; 
export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const { users, updateUser } = useUsers();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const user = users.find((u) => u.id === id);
    if (user) setInitialData(user);
  }, [id, users]);

  const handleUpdate = (updatedData) => {
      if (!id) return;
    updateUser(id as string, updatedData);
    router.push("/users");
  };

 
  if (!initialData) return <p>Loading user data...</p>;

  return (
    <div className="max-w-lg mx-auto mt-8">
      <UserForm initialData={initialData} onSubmit={handleUpdate} isEdit />
    </div>
  );
}
