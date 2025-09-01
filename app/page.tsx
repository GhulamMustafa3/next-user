"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { fetchUser } from "@/lib/api/users";


export default function HomePage() {
const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUser();
        setUsers(data);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">User Directory</h1>
        <p className="text-gray-500">Loading users...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Directory</h1>
      <ul className="space-y-4">
        {users.map((u) => (
          <li
            key={u.id}
            className="flex items-center gap-4 p-4 border rounded-lg shadow-sm hover:bg-gray-50"
          >
            {u.image_url ? (
              <Image
                src={u.image_url}
                alt={u.name}
                width={50}
                height={50}
                className="rounded-full"
              />
            ) : (
              <div className="w-[50px] h-[50px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                N/A
              </div>
            )}

            <div>
              <Link
                href={`/users/${u.id}`}
                className="text-blue-600 font-semibold hover:underline"
              >
                {u.name}
              </Link>
              <p className="text-sm text-gray-600">{u.email}</p>
              <p className="text-xs text-gray-500 capitalize">{u.role}</p>
            </div>
          </li>
        ))}

        {users.length === 0 && (
          <li className="text-gray-500">No users found.</li>
        )}
      </ul>
    </main>
  );
}
