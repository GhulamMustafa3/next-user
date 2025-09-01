"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";
import { updateUser } from "@/lib/api/users";



export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [initialData, setInitialData] = useState<any>(null);


  useEffect(() => {
    const fetchUserById = async () => {
      try {
        const res = await fetch(`http://localhost:8008/users/${id}`);
        if (!res.ok) throw new Error("Failed to fetch user");
        const user = await res.json();
        setInitialData(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    if (id) fetchUserById();
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
        id as string,
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

  return (
    <div className="max-w-lg mx-auto mt-8">
      <UserForm initialData={initialData} onSubmit={handleUpdate} isEdit />
    </div>
  );
}
