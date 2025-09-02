"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { fetchUser, updateUser } from "@/lib/api/users";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function EditUserPage() {
  const { id } =useParams<{ id: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);
    const { isChecking } = useAuthRedirect();

  useEffect(() => {
    const getUser = async () => {
      if (!id) return;

      try {
    
        const users = await fetchUser();
        const user = users.find((u: any) => u.id === id); 
        if (!user) throw new Error("User not found");
        setInitialData(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUser();
  }, [id]);

  const handleUpdate = async (updatedData: {
    name: string;
    email: string;
    age: number;
    role: string;
    image_url: string;
  }) => {
    if (!id) return;

    try {
      const updatedUser = await updateUser(
        id,
        updatedData.name,
        updatedData.email,
        updatedData.age,
        updatedData.role,
        updatedData.image_url
      );

      console.log("User updated:", updatedUser);
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  if (!initialData) return <p>Loading user data...</p>;
   if (isChecking) {
 
    return <p className="p-4">Checking authentication...</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-8">
      <UserForm initialData={initialData} onSubmit={handleUpdate} isEdit />
    </div>
  );
}
