"use client";

import UserForm from "@/components/UserForm";
import { useUsers } from "@/providers/UserProvider";
import { useRouter } from "next/navigation";

export default function AddUserPage() {
  const { addUser } = useUsers();
  const router = useRouter();


  const handleUserAdded = (newUserData) => {
  
    const newUser = {
      id: `u-${Date.now()}`,
    createdAt: new Date().toISOString(),
      ...newUserData,
    };

    addUser(newUser);
  
    
    router.push("/users"); 
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Add New User</h1>

      
      <UserForm onSubmit={handleUserAdded} isEdit={false} />
    </main>
  );
}
