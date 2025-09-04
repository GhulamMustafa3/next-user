"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import UserForm from "@/components/UserForm";

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  role: string;
  image_url: string;
  team?: string[];
}

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [initialData, setInitialData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserById = async () => {
      if (!id) return;

      try {
        const res = await fetch(`http://localhost:8008/api/users/${id}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (res.status === 401) {
          router.push("/auth/login");
          return;
        }

        if (res.status === 404) {
          setInitialData(null);
          setLoading(false);
          return;
        }

        const data: User = await res.json();
        setInitialData(data);
      } catch (err) {
        console.error("Error fetching user by ID", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserById();
  }, [id, router]);

 const handleUpdate = async (updatedData: User) => {
  if (!id) return;

  try {
    const res = await fetch(`http://localhost:8008/api/users/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      const data = await res.json();
      setInitialData(data.user); // <-- update form with latest data
      router.push("/dashboard/user"); // Redirect if you want
    } else {
      console.error("Update failed", await res.json());
    }
  } catch (error) {
    console.error("Error updating user:", error);
  }
};


  if (loading) return <p>Loading user data...</p>;
  if (!initialData) return <p>User not found</p>;

  return (
    <div className="max-w-lg mx-auto mt-8">
      <UserForm initialData={initialData} onSubmit={handleUpdate} isEdit />
    </div>
  );
}
