"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface UserDetailProps {
  user: {
    id: string;
    name: string;
    email: string;
    age?: number;
    role: string;
    image_url?: string;
  } | null;
}

export default function UserDetail({ user }: UserDetailProps) {
  if (!user) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <h1 className="text-3xl font-bold text-gray-500">User not found</h1>
      </div>
    );
  }

  return (
    <div className="flex justify-center mt-10">
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full border border-gray-200"
      >
        <div className="flex justify-center mb-6">
          {user.image_url ? (
            <Image
              src={user.image_url}
              alt={user.name || "User Avatar"}
              width={140}
              height={140}
              className="rounded-full object-cover border-4 border-blue-500"
            />
          ) : (
            <div className="w-36 h-36 rounded-full bg-gray-200 flex items-center justify-center text-4xl font-bold text-gray-500">
              {user.name?.[0] || "?"}
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">{user.name}</h1>

        <div className="flex justify-center mb-6">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800">
            {user.role}
          </span>
        </div>

        <div className="space-y-3 text-gray-700">
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">ID:</span> <span>{user.id}</span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <span className="font-semibold">Email:</span> <span>{user.email}</span>
          </div>
          {user.age && (
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Age:</span> <span>{user.age}</span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
