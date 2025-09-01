"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { deleteUser, fetchUser } from "@/lib/api/users";


export default function UserTable() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const loadUsers = async () => {
      const data = await fetchUser();
      setUsers(data);
    };
    loadUsers();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="mt-4 overflow-x-auto">
      <table className="border-collapse border border-gray-300 w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">ID</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Age</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{u.id}</td>
              <td className="border p-2 text-center">
                {u.image_url ? (
                  <Image
                    src={u.image_url}
                    alt={u.name}
                    width={40}
                    height={40}
                    className="rounded-full mx-auto"
                  />
                ) : (
                  <span className="text-gray-400">No Image</span>
                )}
              </td>
              <td className="border p-2">
                <Link href={`/users/${u.id}`} className="text-blue-600 underline">
                  {u.name}
                </Link>
              </td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.age}</td>
              <td className="border p-2 capitalize">{u.role}</td>

              <td className="border p-2 space-x-2">
                <Link
                  href={`/users/${u.id}/edit`}
                  className="text-green-600 hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="text-red-600 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan={8} className="border p-4 text-center text-gray-500">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
