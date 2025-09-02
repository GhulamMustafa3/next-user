"use client";

import Image from "next/image";

export default function UserDetail({ user }: { user: any }) {
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold">User not found</h1>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg shadow-md max-w-md">
      
      {user.image_url && (
        <div className="mb-4 flex justify-center">
          <Image
            src={user.image_url}
            alt={user.name || "User Avatar"}
            width={120}
            height={120}
            className="rounded-full object-cover"
          />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{user.name}</h1>

      <div className="space-y-2">
        <p>
          <span className="font-semibold">ID:</span> {user.id}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {user.email}
        </p>
        <p>
          <span className="font-semibold">Age:</span> {user.age}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {user.role}
        </p>
      </div>
    </div>
  );
}
