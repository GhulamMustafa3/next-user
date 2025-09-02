"use client";

import UserForm from "@/components/UserForm";
import { useRouter } from "next/navigation";
import { createUser } from "@/lib/api/users";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";

export default function AddUserPage() {
  const router = useRouter();
  const { isChecking } = useAuthRedirect();


  const handleUserAdded = async (newUserData: {
    name: string;
    email: string;
    age: number;
    role: string;
    image_url: string;
  }) => {
    try {

      const newUser = await createUser(
        `u-${Date.now()}`,
        newUserData.name,
        newUserData.email,
        newUserData.age,
        newUserData.role,
        newUserData.image_url
      );

      if (newUser) {
        console.log("User created:", newUser);
        router.push("/users");
      }
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };
  if (isChecking) {

    return <p className="p-4">Checking authentication...</p>;
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add New User</h1>
      <UserForm onSubmit={handleUserAdded} isEdit={false} />
    </main>
  );
}
